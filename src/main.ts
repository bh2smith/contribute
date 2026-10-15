import './style.css';
import './themes/meadow.css';
import './themes/midnight.css';
import { mountApp } from './app';
import { siteConfig, siteTheme } from './config/site';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('Application root is missing.');
mountApp(root, siteConfig, siteTheme);
