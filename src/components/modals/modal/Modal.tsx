import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useOnClickAway } from 'use-on-click-away';
import classNames from 'classnames';

import { ModalContext } from '../../../services/wallet-service/ModalContext';

const Modal = () => {
  console.log(11);
  const ref = useRef<HTMLDivElement>(null);
  const { closeModal, isModalShowed, modalContent } = useContext(ModalContext);

  useEffect(() => {
    const handleExit = (e: KeyboardEvent) => {
      if (ref.current && e.key === 'Escape') {
        closeModal();
        enableBodyScroll(ref.current);
      }
    };

    document.addEventListener('keydown', handleExit);
    return () => document.removeEventListener('keydown', handleExit);
  }, [closeModal]);

  useOnClickAway(ref, () => {
    closeModal();

    if (ref.current) {
      enableBodyScroll(ref.current);
    }
  });

  const modalBackgroundClassnames = useMemo(
    () =>
      classNames('modal-background', {
        'modal-background__is-showed': isModalShowed,
      }),
    [isModalShowed]
  );

  useEffect(() => {
    if (ref && ref.current) {
      if (isModalShowed) {
        disableBodyScroll(ref.current);
      } else enableBodyScroll(ref.current);
    }
  }, [isModalShowed]);

  return (
    <>
      <CSSTransition in={isModalShowed} timeout={300} classNames="modal" unmountOnExit>
        <div ref={ref}>
          {modalContent}
          <div className="modal__button-wrapper">
            <button type="button" onClick={closeModal}>
              Close modal
            </button>
          </div>
        </div>
      </CSSTransition>
      <div className={modalBackgroundClassnames} />
    </>
  );
};

export default Modal;
