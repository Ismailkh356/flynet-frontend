import { useState, useEffect, useMemo } from 'react';
import * as Icon from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Spinner, Form, Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import './bj39dfg8f439dap5.css';
import './i18n.js';
import AnimatedText from './components/animation/uf83fhasi93ani93.jsx';
import './components/h93jdk8si6n.css';
import Faq from './components/fj39dk@d3F983';
import Footer from './components/u8df9jh2ujF23';
import Nbar from './components/yi93df8s@d4n';

// IndexedDB setup for download progress
let db;
const request = indexedDB.open('DownloadProgressDB', 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  db.createObjectStore('downloads', { keyPath: 'url' });
};

request.onsuccess = (event) => {
  db = event.target.result;
};

request.onerror = (event) => {
  console.error('IndexedDB error:', event.target.error);
};

function App() {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [quality, setQuality] = useState('hd_no_watermark');
  const [platform, setPlatform] = useState('tiktok');
  const [cookie, setCookie] = useState('');
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  const { platform: routePlatform } = useParams();

  const platforms = useMemo(() => [
    'tiktok', 'instagram', 'facebook', 'twitter', 'youtube', 'vimeo', 'snapchat', 'bilibili',
    'dailymotion', 'sharechat', 'likee', 'linkedin', 'tumblr', 'pinterest', 'reddit'
  ], []);

  // Set platform from URL if valid
  useEffect(() => {
    if (routePlatform && platforms.includes(routePlatform.toLowerCase())) {
      setPlatform(routePlatform.toLowerCase());
    }
  }, [routePlatform, platforms]);

  // Check if cookie consent exists in localStorage or sessionStorage
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent') || sessionStorage.getItem('cookieConsent');
    if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  const saveProgress = (downloadUrl, bytesLoaded, totalBytes) => {
    if (!db) return;
    const transaction = db.transaction(['downloads'], 'readwrite');
    const store = transaction.objectStore('downloads');
    store.put({ url: downloadUrl, bytesLoaded, totalBytes, timestamp: Date.now() });
  };

  const getProgress = async (downloadUrl) => {
    if (!db) return { bytesLoaded: 0, totalBytes: 0 };
    return new Promise((resolve) => {
      const transaction = db.transaction(['downloads'], 'readonly');
      const store = transaction.objectStore('downloads');
      const request = store.get(downloadUrl);
      request.onsuccess = () => {
        resolve(request.result || { bytesLoaded: 0, totalBytes: 0 });
      };
      request.onerror = () => resolve({ bytesLoaded: 0, totalBytes: 0 });
    });
  };

  // Validate URL for supported platforms
  const validateUrl = (url) => {
    const supportedPlatforms = [
      { platform: 'tiktok', patterns: ['tiktok.com', 'vm.tiktok.com'] },
      { platform: 'youtube', patterns: ['youtube.com', 'youtu.be'] },
      { platform: 'instagram', patterns: ['instagram.com'] },
      { platform: 'facebook', patterns: ['facebook.com'] },
      { platform: 'twitter', patterns: ['twitter.com', 'x.com'] },
      { platform: 'vimeo', patterns: ['vimeo.com'] },
      { platform: 'snapchat', patterns: ['snapchat.com'] },
      { platform: 'bilibili', patterns: ['bilibili.com'] },
      { platform: 'dailymotion', patterns: ['dailymotion.com'] },
      { platform: 'sharechat', patterns: ['sharechat.com'] },
      { platform: 'likee', patterns: ['likee.com'] },
      { platform: 'linkedin', patterns: ['linkedin.com'] },
      { platform: 'tumblr', patterns: ['tumblr.com'] },
      { platform: 'pinterest', patterns: ['pinterest.com'] },
      { platform: 'reddit', patterns: ['reddit.com'] },
    ];

    // Check if the URL matches any platform's patterns
    for (const { platform, patterns } of supportedPlatforms) {
      if (patterns.some(pattern => url.includes(pattern))) {
        return platform; // Return the matched platform
      }
    }

    return null; // No match found
  };

  const handleDownload = async (customUrl = url) => {
    setLoading(true);
    setError('');
    setDownloadLink('');
    setDownloading(false);

    console.log('Sending URL:', customUrl, 'Platform:', platform, 'Quality:', quality, 'Cookie:', cookie ? 'Provided' : 'Not provided');

    if (!customUrl) {
      setError(<p className='err'>{t('errorInvalidUrl')}</p>);
      setLoading(false);
      return;
    }

    // Validate the URL
    const platformMatch = validateUrl(customUrl);
    if (!platformMatch) {
      setError(<p className='err'>{t('errorInvalidPastedUrl')}</p>);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/download', { url: customUrl, quality, cookie }, {
        headers: {
          'X-RateLimit-Limit': true
        }
      });

      console.log('Received response:', response.data);

      const { downloadUrl, source, type } = response.data;
      if (!downloadUrl || !downloadUrl.startsWith('/video')) {
        throw new Error(t('errorDownload'));
      }
      setDownloadLink(downloadUrl);
      setError(<p className='err'>{t('Video Founded Successfull!', { type, source })}</p>);
    } catch (error) {
      console.error('Error downloading media:', error);
      setError(
        error.response?.data?.error ||
        (error.message === 'Network Error' ? <p className='err'>{t('errorNetwork')}</p> : 
         error.response?.status === 429 ? <p className='err'>{t('errorRateLimit')}</p> : 
         <p className='err'>{t('errorDownload')}</p>)
      );
    }
    setLoading(false);
  };

  const handleDownloadClick = async () => {
    if (!downloadLink) return;

    setDownloading(true);
    setError('');
    const fullUrl = `${window.location.origin}${downloadLink}`;
    const { bytesLoaded, totalBytes } = await getProgress(fullUrl);

    try {
      let range = bytesLoaded > 0 ? `bytes=${bytesLoaded}-` : '';
      const response = await axios.get(fullUrl, {
        responseType: 'blob',
        headers: range ? { Range: range } : {},
        onDownloadProgress: (progressEvent) => {
          const loaded = bytesLoaded + progressEvent.loaded;
          const total = totalBytes || progressEvent.total || 0;
          console.log(`Download Progress: ${Math.round((loaded * 100) / total)}%`);
        }
      });

      if (bytesLoaded > 0 && response.data.size > 0) {
        const existingBlob = new Blob([new Uint8Array(bytesLoaded)]);
        const newBlob = new Blob([existingBlob, response.data], { type: response.data.type });
        saveAs(newBlob, `media_${new Date().getTime()}.${response.data.type.split('/')[1] || 'mp4'}`);
      } else {
        saveAs(response.data, `media_${new Date().getTime()}.${response.data.type.split('/')[1] || 'mp4'}`);
      }

      saveProgress(fullUrl, 0, 0);
      setDownloadLink('');
      setUrl('');
    } catch (error) {
      if (error.response && error.response.status === 416) {
        console.error('Range error, restarting download:', error);
        saveProgress(fullUrl, 0, totalBytes || 0);
        setError(<p className='err'>{t('errorInterrupted')}</p>);
      } else if (error.message === 'Network Error') {
        const loaded = bytesLoaded + (error.config?.onDownloadProgress?.loaded || 0);
        const total = totalBytes || 0;
        saveProgress(fullUrl, loaded, total);
        setError(<p className='err'>{t('errorResume')}</p>);
      } else {
        console.error('Error downloading media file:', error);
        setError(<p className='err'>{t('errorDownloadFile')}</p>);
      }
    }
    setDownloading(false);
  };

  const handlePasteLink = async () => {
    try {
      const pastedUrl = await navigator.clipboard.readText();
      const platformMatch = validateUrl(pastedUrl);

      if (platformMatch) {
        setUrl(pastedUrl);
        setPlatform(platformMatch);
        setError('');
        await handleDownload(pastedUrl); // Automatically trigger download
      } else {
        setError(<p className='err'>{t('errorInvalidPastedUrl')}</p>);
      }
    } catch (error) {
      console.error('Error pasting link:', error);
      setError(<p className='err'>{t('errorPaste')}</p>);
    }
  };

  const handleClearInput = () => {
    setUrl('');
    setError('');
    setDownloadLink('');
  };

  const handleCookieConsent = (agree) => {
    if (agree) {
      localStorage.setItem('cookieConsent', 'true');
      sessionStorage.setItem('cookieConsent', 'true');
    } else {
      localStorage.removeItem('cookieConsent');
      sessionStorage.removeItem('cookieConsent');
    }
    setShowCookieConsent(false);
  };

  const handleShowCookieConsent = () => {
    setShowCookieConsent(true);
  };

  return (
    <div className='footer'>
      <Nbar />
      <h5 className="app-title">{t('appTitle', 'FlyNet Downloader – Free Online Video Downloader for TikTok, Instagram, Facebook, Twitter, and More')}</h5>
      <div className="app-container">
        <AnimatedText />
        <p className="app-subtitle">{t('appSubtitle', 'Discover the ultimate free online video downloader with FlyNet Downloader! Download videos, images, and audio from TikTok, Instagram, Facebook, Twitter, and more—secure, fast, and easy, perfect for any video downloader user.')}</p>
        <div className="input-group">
          <Form.Control
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('placeholder')}
            className="form-cont"
          />
          <Button onClick={handlePasteLink} className="btn btn-outline-secondary paste-btn">
            <Icon.ArrowUp className='Icon' /> {t('pasteLink')}
          </Button>
          {url && (
            <Button
              onClick={handleClearInput}
              className="btn btn-outline-danger clear-btn"
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', padding: '5px 10px', zIndex: 1 }}
              aria-label="Clear input"
            >
              <Icon.X className="Icon" />
            </Button>
          )}
        </div>
        <Form.Group className="mb-3 mt-3">
          <Form.Label>{t('platformLabel')}</Form.Label>
          <Form.Select value={platform} onChange={(e) => setPlatform(e.target.value)} className="form-select">
            {platforms.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t('qualityLabel')}</Form.Label>
          <Form.Select value={quality} onChange={(e) => setQuality(e.target.value)} className="form-select">
            <option value="hd_no_watermark">{t('hd_no_watermark', 'HD (No Watermark) - Video Downloader')}</option>
            <option value="no_watermark">{t('no_watermark', 'Standard (No Watermark) - Video Downloader')}</option>
            <option value="watermark">{t('watermark', 'Standard (With Watermark) - Video Downloader')}</option>
            <option value="jpg">{t('jpg', 'High Quality - Image for Video Downloader')}</option>
            <option value="mp3">{t('mp3', 'High Quality - Audio for Video Downloader')}</option>
          </Form.Select>
        </Form.Group>
        {(platform === 'instagram' || platform === 'facebook') && (
          <Form.Group className="mb-3">
            <Form.Label>{t('cookieLabel')}</Form.Label>
            <Form.Control
              type="text"
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder={t('cookiePlaceholder')}
              className="form-cont"
            />
          </Form.Group>
        )}
        <Button
          onClick={handleDownload}
          disabled={loading || !url}
          variant="primary"
          className="download-btn mt-3 w-100"
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              {t('downloadNow')}
            </>
          ) : (
            <>
              <Icon.Download className='Icon' /> {t('downloadNow')}
            </>
          )}
        </Button>
        {error && <p className="error mt-2">{error}</p>}
        {loading && (
          <div className="text-center mt-3">
            <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
            <span className="visually-hidden">Loading...</span>
            <p>{t('Searching Video...')}</p>
          </div>
        )}
        {downloadLink && !loading && !downloading && (
          <Button
            onClick={handleDownloadClick}
            variant="primary"
            className="download-link-btn mt-3 w-100"
          >
            <Icon.Save className='Icon' /> {t('saveVideo')}
          </Button>
        )}
        {downloading && (
          <div className="text-center mt-3">
            <Spinner animation="grow" size="sm" role="status" aria-hidden="true" />
            <span className="visually-hidden">Loading...</span>
            <p>{t('Downloading Video...')}</p>
          </div>
        )}
      </div>
      <Faq />
      <Footer />

      {/* Cookie Consent Popup */}
      <Modal
        show={showCookieConsent}
        onHide={() => setShowCookieConsent(false)}
        centered
        animation
        className="cookie-consent-modal"
      >
        <Modal.Body className="p-4">
          <h4 className="mb-3" style={{ color: '#f02c50' }}>{t('cookieTitle', 'Cookie Consent for Video Downloader')}</h4>
          <p className="mb-3">
            {t('cookieMessage', 'We use cookies and cache to enhance your experience on FlyNet Downloader. Coockes can increase the browser speed on your device if you visit next time to improve functionality, and analyze usage for our free video downloader. Your privacy is our priority—we never store personal data or downloaded content. By agreeing, you consent to our use of cookies. You can manage or withdraw consent at any time in Settings.')}
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button
              variant="outline-primary"
              onClick={() => handleCookieConsent(false)}
              className="px-4 py-2"
              style={{ transition: 'all 0.3s ease' }}
            >
              {t('disagree', 'Disagree for Video Downloader')}
            </Button>
            <Button
              variant="primary"
              onClick={() => handleCookieConsent(true)}
              className="px-4 py-2"
              style={{ transition: 'all 0.3s ease' }}
            >
              {t('agree', 'Agree for Video Downloader')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Settings Link for Revisiting Consent */}
      <Button
        variant="link"
        onClick={handleShowCookieConsent}
        className="cookie-settings-btn mt-3"
        style={{ color: '#f02c50', textDecoration: 'none', fontSize: '0.9rem' }}
      >
        {t('cookieSettings', 'Cookie Preferences for Video Downloader')}
      </Button>
    </div>
  );
}

export default App;