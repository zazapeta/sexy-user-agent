import React, { useState, useRef, useEffect } from 'react';
import merge from 'lodash.merge';
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

import { getQueryParams, getUserInfosFromUserAgent } from './utils';

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

function useUserInfos(qs, ua) {
  const [userInfos, setUserInfos] = useState(
    merge(
      {
        ua: navigator.userAgent,
        cw: document.body.clientWidth,
        ch: document.body.clientHeight,
        lg: navigator.language.split('-').pop(),
      },
      getUserInfosFromUserAgent(navigator.userAgent),
    ),
  );
  useEffect(
    () => setUserInfos(merge(userInfos, qs, getUserInfosFromUserAgent(ua))),
    [ua],
  );
  return userInfos;
}

const QS = getQueryParams(window.location.href, decodeURI);

function App({ classes }) {
  const { browser, device, os, ua, cw, ch, lg } = useUserInfos(
    QS,
    QS.ua || navigator.userAgent,
  );

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const inputUrl = useRef(null);

  function copyTextFromUrlInput() {
    inputUrl.current.select();
    document.execCommand('copy');
    setIsSnackbarOpen(true);
    setTimeout(() => setIsSnackbarOpen(false), 3000);
  }

  const urlValue = encodeURI(
    `${window.location.origin}?ua=${ua}&cw=${cw}&ch=${ch}&lg=${lg}`,
  );
  const deviceType = device.type || DEVICE_DEFAULT.type;
  const deviceIcon =
    (DEVICES[device.type] && DEVICES[device.type].icon) || DEVICE_DEFAULT.icon;
  const deviceModel = device.model;
  const deviceVendor = device.vendor;
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
          {deviceVendor && deviceModel ? (
            <React.Fragment>
              <InfoIcon
                title="Device"
                label={`${deviceVendor} - ${deviceModel}`}
                icon={deviceIcon}
              />
            </React.Fragment>
          ) : (
            <InfoIcon title="Device" label={deviceType} icon={deviceIcon} />
          )}
          <Info title="Browser" label={browser.version} value={browser.name} />
          <Info title="Device size" label="Width" value={cw} />
          <Info title="Device size" label="Height" value={ch} />

          <InfoIcon
            title="Orientation"
            label={isPortrait ? 'Portrait' : 'Paysage'}
            icon={isPortrait ? CropPortrait : Tablet}
          />
          <Info
            title="Langue"
            label={lg}
            value={<Flag height={22} code={lg} />}
          />
        </List>
        <Paper>
          <TextField
            className={classes.margin}
            inputRef={inputUrl}
            readOnly
            autoFocus
            type="url"
            label="URL to copy"
            onClick={copyTextFromUrlInput}
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
            open={isSnackbarOpen}
            message={<div>Copied</div>}
            action={[<Check />]}
          />
        </Paper>
      </div>
    </div>
  );
}

export default withStyles(styles)(App);
