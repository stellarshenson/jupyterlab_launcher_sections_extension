# Changelog

<!-- <START NEW CHANGELOG ENTRY> -->

## [1.0.9] - 2026-10-31

### Changed

- Require Python 3.12

## [1.0.8] - 2026-10-31

### Changed

- Apply the template files and packages the upgrade left out
- Ignore youtube links in check-links

## [1.0.6] - 2026-10-31

### Changed

- Upgrade to extension template v4.6.5 and Makefile 1.46

### Fixed

- Take the scoped @stellarshenson/jupyterlab-launcher-sections-extension npm name

## 1.0.1

Initial public release.

### Features

- YAML-based configuration for launcher section icons
- Load configs from `{jupyter_data_dir}/jupyter_launcher_sections/*.yaml` or `*.yml`
- JSON schema validation for configuration files
- SVG icon support with relative or absolute paths
- Custom tooltips for launcher sections
- MutationObserver-based icon replacement for dynamic launcher content

### Configuration

Create YAML files in `jupyter_launcher_sections/` directory:

```yaml
- section: 'Services'
  icon: 'services.svg'
  tooltip: 'Supporting services for data science'
```

<!-- <END NEW CHANGELOG ENTRY> -->
