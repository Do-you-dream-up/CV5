import '../../tools/internationalization';

import { ThemeProvider, createUseStyles } from 'react-jss';
import { useEffect, useState } from 'react';

import Axios from 'axios';
import { ConfigurationProvider } from '../../contexts/ConfigurationContext';
import { DialogProvider } from '../../contexts/DialogContext';
import { EventsProvider } from '../../contexts/EventsContext';
import { ModalProvider } from '../../contexts/ModalContext';
import PropTypes from 'prop-types';
import { TabProvider } from '../../contexts/TabContext';
import breakpoints from '../../styles/breakpoints';
import { configuration } from '../../tools/configuration';
import data from '../../tools/configuration.json';
const css = JSON.parse(localStorage.getItem('dydu.css'));

const useStyles = createUseStyles({
  root: {
    '& > *': {
      margin: 8,
    },
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: -8,
  },
});

const json = configuration.sanitize(data);

export default function Wrapper({ children }) {
  const classes = useStyles();
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    Axios.get(`${process.env.PUBLIC_URL}override/theme.json`).then((res) => {
      const data = res && res.data ? res.data : {};
      data.palette.primary.main = css ? css.main : data.palette.primary.main;
      data.breakpoints = breakpoints;
      setTheme(data);
    });
  }, []);
  return (
    theme && (
      <ThemeProvider theme={theme}>
        <ConfigurationProvider configuration={json}>
          <EventsProvider>
            <DialogProvider>
              <ModalProvider>
                <TabProvider>
                  <div children={children} className={classes.root} />
                </TabProvider>
              </ModalProvider>
            </DialogProvider>
          </EventsProvider>
        </ConfigurationProvider>
      </ThemeProvider>
    )
  );
}

Wrapper.propTypes = {
  children: PropTypes.element,
};
