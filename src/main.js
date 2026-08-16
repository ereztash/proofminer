import './style.css';
import { mountApp } from './ui/app.js';

const root = document.querySelector('#app');
if (root) mountApp(root);
