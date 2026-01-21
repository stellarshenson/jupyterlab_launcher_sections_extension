import { LabIcon } from '@jupyterlab/ui-components';
import { ISectionConfig } from './types';

/**
 * Applies custom icons to launcher sections using MutationObserver.
 */
export class LauncherSectionApplier {
  private _configs: Map<string, ISectionConfig> = new Map();
  private _observer: MutationObserver | null = null;
  private _processedSections: WeakSet<Element> = new WeakSet();

  /**
   * Set the section configurations.
   */
  setConfigs(configs: ISectionConfig[]): void {
    this._configs.clear();
    for (const config of configs) {
      this._configs.set(config.section, config);
    }
  }

  /**
   * Start observing the DOM for launcher sections.
   */
  start(): void {
    if (this._observer) {
      return;
    }

    // Apply to existing sections
    this._applyToExistingSections();

    // Observe for new sections
    this._observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          for (const node of addedNodes) {
            if (node instanceof Element) {
              this._processElement(node);
            }
          }
        }
      }
    });

    this._observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Stop observing the DOM.
   */
  stop(): void {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  /**
   * Apply icons to all existing launcher sections.
   */
  private _applyToExistingSections(): void {
    const sections = Array.from(
      document.querySelectorAll('.jp-Launcher-section')
    );
    console.log(
      `[LauncherSectionIcons] Found ${sections.length} launcher sections`
    );
    for (const section of sections) {
      this._applySectionConfig(section);
    }
  }

  /**
   * Process a newly added element.
   */
  private _processElement(element: Element): void {
    // Check if this is a launcher section
    if (element.classList.contains('jp-Launcher-section')) {
      this._applySectionConfig(element);
    }

    // Check children for launcher sections
    const sections = Array.from(
      element.querySelectorAll('.jp-Launcher-section')
    );
    for (const section of sections) {
      this._applySectionConfig(section);
    }
  }

  /**
   * Apply configuration to a launcher section.
   */
  private _applySectionConfig(section: Element): void {
    // Skip if already processed
    if (this._processedSections.has(section)) {
      return;
    }

    // Get section title
    const titleElement = section.querySelector('.jp-Launcher-sectionTitle');
    if (!titleElement) {
      console.log('[LauncherSectionIcons] No title element found in section');
      return;
    }

    const sectionName = titleElement.textContent?.trim();
    if (!sectionName) {
      console.log('[LauncherSectionIcons] Empty section name');
      return;
    }

    console.log(
      `[LauncherSectionIcons] Processing section: "${sectionName}"`
    );

    // Get config for this section
    const config = this._configs.get(sectionName);
    if (!config) {
      console.log(
        `[LauncherSectionIcons] No config for section: "${sectionName}"`
      );
      return;
    }

    console.log(
      `[LauncherSectionIcons] Applying config to section: "${sectionName}"`
    );

    // Mark as processed
    this._processedSections.add(section);

    // Apply icon if configured
    if (config.icon) {
      this._applyIcon(section, config.icon);
    }

    // Apply tooltip if configured
    if (config.tooltip) {
      this._applyTooltip(section, config.tooltip);
    }
  }

  /**
   * Replace the section icon with custom SVG.
   */
  private _applyIcon(section: Element, svgContent: string): void {
    const header = section.querySelector('.jp-Launcher-sectionHeader');
    if (!header) {
      console.log('[LauncherSectionIcons] No header found');
      return;
    }

    // Find existing icon container - try multiple selectors
    let existingIcon = header.querySelector('.jp-icon-selectable');

    // If not found, look for the first element that contains an SVG (before the title)
    if (!existingIcon) {
      const title = header.querySelector('.jp-Launcher-sectionTitle');
      if (title) {
        // Look for sibling element before title that contains SVG
        let sibling = title.previousElementSibling;
        while (sibling) {
          if (sibling.querySelector('svg') || sibling.tagName === 'SVG') {
            existingIcon = sibling;
            break;
          }
          sibling = sibling.previousElementSibling;
        }
      }
    }

    if (!existingIcon) {
      console.log('[LauncherSectionIcons] No icon element found in header');
      return;
    }

    console.log('[LauncherSectionIcons] Found icon element, replacing...');

    // Create a new LabIcon with the SVG content
    const iconId = `launcher-section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const customIcon = new LabIcon({
      name: iconId,
      svgstr: svgContent
    });

    // Create the new icon element
    const newIconElement = customIcon.element({
      className: 'jp-icon-selectable',
      tag: 'span',
      stylesheet: 'launcherSection'
    });

    // Replace the existing icon
    existingIcon.replaceWith(newIconElement);
    console.log('[LauncherSectionIcons] Icon replaced successfully');
  }

  /**
   * Apply tooltip to section header.
   */
  private _applyTooltip(section: Element, tooltip: string): void {
    const header = section.querySelector('.jp-Launcher-sectionHeader');
    if (header instanceof HTMLElement) {
      header.title = tooltip;
    }
  }
}
