import React, { useEffect, useState } from 'react';
import Scroll from 'react-scroll';
import InfoModal from '../../components/Modal/InfoModal';

const TestPage = () => {
  const Link = Scroll.Link;
  const [show, setShow] = useState(false);
  useEffect(() => {
    // setTimeout(() => {
    setShow(true);
    // }, 500);
  }, []);
  return (
    <div>
      <InfoModal show={true} onCloseModal={() => {}}>
        {show && (
          <ul className="fixed">
            <Link to="test1" activeClass="text-primary-200" spy={true} containerId="myContainer" onSetActive={() => {}}>
              test1
            </Link>
            <Link to="test2" activeClass="text-primary-200" spy={true} containerId="myContainer">
              test2
            </Link>
            <Link to="test3" activeClass="text-primary-200" spy={true} containerId="myContainer" onSetActive={() => {}}>
              test3
            </Link>
          </ul>
        )}
        <Container />
      </InfoModal>
    </div>
  );
};

export default TestPage;

const Container = () => {
  const Element = Scroll.Element;
  return (
    <div id="myContainer" className="overflow-y-scroll max-h-80">
      <Element name="test1" className="h-screen bg-white" as="div"></Element>
      <Element name="test2" className="h-screen bg-primary-200" as="div"></Element>
      <Element name="test3" className="h-screen bg-green-300" as="div"></Element>
    </div>
  );
};
