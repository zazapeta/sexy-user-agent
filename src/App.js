import React, { Component, useState } from 'react';
import UAParser from 'ua-parser-js';
import './App.css';

import {
  Paper,
  InputAdornment,
  IconButton,
  TextField,
  ListItem,
  List,
  ListItemText,
  Snackbar,
  Button,
} from '@material-ui/core';
import Flag from 'react-world-flags';

import { withStyles } from '@material-ui/core/styles';
import {
  Tablet,
  Laptop,
  Smartphone,
  FilterFrames,
  Check,
  CropPortrait,
  FileCopy,
  Refresh,
} from '@material-ui/icons';

function getUrlVars() {
  let vars = {};
  let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
    m,
    key,
    value,
  ) {
    vars[key] = value;
  });
  return vars;
}

const styles = (theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

const DEVICES = [
  { type: 'tablet', icon: Tablet },
  { type: 'mobile', icon: Smartphone },
  { type: 'embedded', icon: FilterFrames },
];
const DEVICE_DEFAULT = { type: 'desktop', icon: Laptop };

function Info({ title, label, value }) {
  return (
    <ListItem className="info">
      <ListItemText primary={title} secondary={label} />
      <div>{value}</div>
    </ListItem>
  );
}

function InfoIcon({ icon: Icon, ...rest }) {
  return <Info {...rest} value={<Icon style={{ fontSize: '2em' }} />} />;
}

function App({ classes }) {
  const [browser, setBrowser] = useState({ name: 'Hello', version: 'World' });
  return (
    <div className="App">
      <Button
        size="small"
        color="primary"
        href="https://github.com/zazapeta/sexy-user-agent"
        variant="extendedFab"
        style={{ opacity: 0.5, position: 'absolute', zIndex: 10 }}
      >
        GitHub
      </Button>
      <IconButton color="secondary" href={window.location.origin}>
        <Refresh />
      </IconButton>

      <div className={classes.root}>
        <List style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Info title="Browser" label={browser.version} value={browser.name} />
          <Info
            title="Langue"
            label={navigator.language}
            value={<Flag height={22} code={'FR'} />}
          />
        </List>
      </div>
    </div>
  );
}

class App__ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      browser: {
        name: '',
        version: '',
      },
      lang: null,
      device: DEVICE_DEFAULT,
      os: {
        name: '',
        version: '',
      },
      isOpen: false,
      urlValue: window.location.href,
    };
    this.handleUrlClick = this.handleUrlClick.bind(this);
  }

  componentDidMount() {
    const parser = new UAParser();
    let ua = getUrlVars()['ua'];
    if (ua) {
      ua = decodeURI(ua);
      parser.setUA(ua);
    }
    const device = parser.getDevice();
    const cw = getUrlVars()['cw'] || document.body.clientWidth;
    const ch = getUrlVars()['ch'] || document.body.clientHeight;
    const lg = getUrlVars()['lg'] || navigator.language.split('-').pop();
    this.setState({
      browser: parser.getBrowser(),
      lang: navigator.language || navigator.userLanguage,
      device:
        (device &&
          device.type &&
          DEVICES.find((d) => d.type === device.type)) ||
        DEVICE_DEFAULT,
      rawDevice: device,
      os: parser.getOS(),
      urlValue: ua
        ? window.location.href
        : encodeURI(
            window.location.origin +
              `?ua=${JSON.stringify(
                parser.getUA(),
              )}&cw=${cw}&ch=${ch}&lg=${lg}`,
          ),
    });
  }

  handleUrlClick() {
    this.urlInput.select();
    document.execCommand('copy');
    this.setState({
      isOpen: true,
    });
    setTimeout(
      () =>
        this.setState({
          isOpen: false,
        }),
      3000,
    );
  }
  render() {
    const { browser, device, os, isOpen, rawDevice, urlValue } = this.state;
    const { classes } = this.props;

    const cw = getUrlVars()['cw'] || document.body.clientWidth;
    const ch = getUrlVars()['ch'] || document.body.clientHeight;
    const lg = getUrlVars()['lg'] || navigator.language.split('-').pop();

    const isPortrait = ch > cw;
    return (
      <div className="App">
        <Button
          size="small"
          color="primary"
          href="https://github.com/zazapeta/sexy-user-agent"
          variant="extendedFab"
          style={{ opacity: 0.5, position: 'absolute', zIndex: 10 }}
        >
          GitHub
        </Button>
        <IconButton color="secondary" href={window.location.origin}>
          <Refresh />
        </IconButton>

        <div className={classes.root}>
          <List style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <Info title="OS" label={os.version} value={os.name} />
            {rawDevice && rawDevice.type ? (
              <React.Fragment>
                <InfoIcon
                  title="Device"
                  label={`${rawDevice.vendor} - ${rawDevice.model}`}
                  icon={device.icon}
                />{' '}
              </React.Fragment>
            ) : (
              <InfoIcon title="Device" label={device.type} icon={device.icon} />
            )}
            <Info
              title="Browser"
              label={browser.version}
              value={browser.name}
            />
            <Info title="Device size" label="Width" value={cw} />
            <Info title="Device size" label="Height" value={ch} />

            <InfoIcon
              title="Orientation"
              label={isPortrait ? 'Portrait' : 'Paysage'}
              icon={isPortrait ? CropPortrait : Tablet}
            />
            <Info
              title="Langue"
              label={navigator.language}
              value={<Flag height={22} code={lg} />}
            />
          </List>

          <Paper>
            <TextField
              className={classes.margin}
              inputRef={(urlInput) => (this.urlInput = urlInput)}
              readOnly
              autoFocus
              type="url"
              label="URL to copy"
              onClick={this.handleUrlClick}
              value={urlValue}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <FileCopy />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              open={isOpen}
              message={<div>Copied</div>}
              action={[<Check />]}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
