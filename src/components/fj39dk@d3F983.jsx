import "../bj39dfg8f439dap5.css"


import { useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import './f8jdl9ksF83j.css';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { ProgressBar } from 'primereact/progressbar';

const Faq = () => {
  const { t } = useTranslation(); // Use translation hook
  const [click, setClick] = useState(''); 

  const toggle = (idx) => {
    if (click === idx) {
      return setClick(null);
    }
    setClick(idx);
  };

  // Define FAQ keys with SEO-optimized titles
  const faqKeys = [
    'legalDisclaimer',
    'accidentlyclose',
    'supportedPlatforms',
    'downloadLocation',
    'mobileCompatibility',
    'downloadSpeed',
    'technicalSupport',
    'privacySecurity',
    'legalConsiderations',
  ];

  return (
    <>
      <div className="sdo app-container dark-them">
        <h4>FlyNetDownloader.com</h4>
        <span>{t('FlyNet Downloader is the most Advanced and secure online tool for downloading videos, audio, and images from popular social media platforms like Facebook, Instagram, TikTok, YouTube, LinkdIn, Twitter and more Without (Water Mark) . No app or software installation is required—simply paste the link and download instantly on any device. Built with privacy in mind, FlyNet Downloader does not store any downloads or personal data, ensuring a safe and hassle-free experience for users looking to save their favorite media effortlessly.')}</span>
      </div>
      <div className="faq">
        <div className="card">
          <ProgressBar value={50}></ProgressBar>
        </div>
        <div className="container">
          <h4 className="now">{t('whatYouNeedToKnow', 'WHAT YOU NEED TO KNOW ABOUT VIDEO DOWNLOADER?')}</h4>
          {faqKeys.map((key, index) => (
            <div className="box" key={index}>
              <button className="accordion" onClick={() => toggle(index)} key={index}>
                <h4>{t(`faqs.${key}.title`)}</h4>
                <span>{click === index ? <Icon.ChevronCompactUp /> : <Icon.ChevronCompactDown />}</span>
              </button>
              {click === index ? (
                <div className="text">
                  <p>{t(`faqs.${key}.desc`)}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Faq;