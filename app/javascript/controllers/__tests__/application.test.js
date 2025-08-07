import { Application } from "@hotwired/stimulus"
import { application } from '../application'

describe('Application Controller', () => {
  it('exports a stimulus application', () => {
    expect(application).toBeInstanceOf(Application);
  });

  it('sets application debug to false', () => {
    expect(application.debug).toBe(false);
  });

  it('adds application to window.Stimulus', () => {
    expect(window.Stimulus).toBe(application);
  });
});