import './style.css';
import { mountApp } from './app';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('Application root is missing.');
mountApp(root);
