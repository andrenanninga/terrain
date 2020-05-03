import { App } from "../src/App";

const domElement: HTMLElement = document.querySelector(".app");

if (!domElement) {
	throw new Error('domElement with class "app" not found');
} else {
	window.app = new App(domElement);
}
