import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  MapContainer,
  useMap,
  useMapEvents,
  ScaleControl
} from 'react-leaflet';
import PropTypes from 'prop-types';
import LayersControl from './LayersControl';
import FullscreenControl from './FullscreenControl';
import LocateControl from './LocateControl';

const Wrapper = styled.div(
  ({ theme, $wholePage }) => `
  width: calc(100% - 10px);
  height: 400px;

  ${theme.breakpoints.up('md')} {
    ${!$wholePage && `margin-right: ${theme.spacing(2)}px;`}
  }
${$wholePage && `height: calc(100vh - ${theme.appBarHeight}px);`}
`
);

// The Map, once mounted, doesn't change its center: this Centerer forces it
// See https://github.com/PaulLeCam/react-leaflet/issues/796#issuecomment-743181396
const Centerer = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const baseLayerChange = event => {
  window.localStorage.setItem('selectedBaseLayer', event.name);
};

const handleResize = map => {
  if (!map) return;
  const myObserver = new ResizeObserver(() => {
    setTimeout(() => {
      map.invalidateSize(true);
    }, 100);
  });
  myObserver.observe(map.getContainer());
  map.on('baselayerchange', baseLayerChange);
};

Centerer.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number)
};

const FullscreenInteraction = () => {
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);
  const map = useMapEvents({
    enterFullscreen() {
      setMapCenter(map.getCenter());
      setMapZoom(map.getZoom());
      map.dragging.enable();
      map.scrollWheelZoom.enable();
    },
    exitFullscreen() {
      map.setView(mapCenter, mapZoom, { animate: false });
      map.dragging.disable();
      map.scrollWheelZoom.disable();
    }
  });
  return <FullscreenControl forceSeparateButton="true" />;
};

const CustomMapContainer = ({
  wholePage = true,
  center,
  zoom,
  dragging = true,
  scrollWheelZoom = true,
  isSideMenuOpen = false,
  isLocateControl = false,
  isFullscreenAllowed = true,
  shouldChangeControlInFullscreen = true,
  style,
  children,
  forceCentering
}) => (
  <Wrapper $wholePage={wholePage}>
    <MapContainer
      style={{ height: '100%', width: '100%', ...style }}
      wholePage={wholePage}
      center={center}
      zoom={zoom}
      dragging={dragging}
      scrollWheelZoom={scrollWheelZoom}
      isSideMenuOpen={isSideMenuOpen}
      minZoom={1}
      ref={handleResize}
      preferCanvas>
      {isFullscreenAllowed && shouldChangeControlInFullscreen && (
        <FullscreenInteraction />
      )}
      {isFullscreenAllowed && !shouldChangeControlInFullscreen && (
        <FullscreenControl forceSeparateButton="true" />
      )}
      {forceCentering && <Centerer center={center} />}
      {isLocateControl && <LocateControl />}
      <ScaleControl position="bottomright" />
      <LayersControl />
      {children}
    </MapContainer>
  </Wrapper>
);

CustomMapContainer.propTypes = {
  wholePage: PropTypes.bool,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  dragging: PropTypes.bool,
  scrollWheelZoom: PropTypes.bool,
  children: PropTypes.node,
  isSideMenuOpen: PropTypes.bool,
  isLocateControl: PropTypes.bool,
  isFullscreenAllowed: PropTypes.bool,
  shouldChangeControlInFullscreen: PropTypes.bool,
  style: PropTypes.shape({}),
  forceCentering: PropTypes.bool
};

export default CustomMapContainer;
