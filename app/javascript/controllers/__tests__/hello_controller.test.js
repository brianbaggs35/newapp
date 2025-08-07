import { Controller } from "@hotwired/stimulus"
import HelloController from '../hello_controller'

// Mock DOM element
class MockElement {
  constructor() {
    this.textContent = '';
  }
}

describe('HelloController', () => {
  let controller;
  let element;

  beforeEach(() => {
    element = new MockElement();
    controller = new HelloController();
    controller.element = element;
  });

  it('extends Controller', () => {
    expect(controller).toBeInstanceOf(Controller);
  });

  it('sets text content to "Hello World!" when connected', () => {
    controller.connect();
    expect(element.textContent).toBe('Hello World!');
  });

  it('has connect method', () => {
    expect(typeof controller.connect).toBe('function');
  });
});