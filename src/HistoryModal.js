/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';

function HistoryModal({
  modalOpen,
  history,
  historyModalOpen,
  toggleModal,
  closeModal,
}) {
  const modalRef = useRef(null);

  const outsideClickCloseModal = useCallback(
    ({ target }) => {
      if (modalRef && modalRef.current && !modalRef.current.contains(target)) {
        toggleModal();
      }
    },
    [toggleModal]
  );

  useEffect(() => {
    document.addEventListener('click', outsideClickCloseModal, {
      capture: true,
    });

    return () => {
      document.removeEventListener('click', outsideClickCloseModal, {
        capture: true,
      });
    };
  }, [historyModalOpen, outsideClickCloseModal]);

  useEffect(() => {
    const closeOnEscapeKey = (e) => (e.key === 'Escape' ? closeModal() : null);
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [closeModal]);

  let count = history.length;

  return modalOpen
    ? ReactDom.createPortal(
        <div className="bg-black bg-opacity-70 fixed top-0 left-0 overflow-x-hidden overflow-y-auto block w-full h-full">
          <div
            ref={modalRef}
            className="flex items-center relative transform-none w-screen max-w-none h-full min-h-[calc(100%-1rem)] m-0 sm:mt-7 sm:max-w-lg sm:w-auto sm:m-auto sm:min-h-[calc(100%-3.5rem)] sm:h-[calc(100%-3.5rem)] lg:max-w-3xl"
          >
            <div className="flex flex-col relative bg-clip-padding bg-light-gray dark:bg-dark-gray rounded xs:rounded-none w-full xs:h-full md:w-[50rem] max-h-full overflow-hidden">
              <div className="flex flex-shrink-0 border-b border-b-dark-gray dark:border-b-white w-full p-4 justify-between items-center text-xl font-bold text-theme-color">
                <h3>History</h3>
                <button
                  type="button"
                  className="flex justify-center flex-row text-light-gray dark:text-dark-gray bg-theme-color bg-opacity-60 rounded cursor-pointer hover:bg-opacity-80 duration-100 w-7 h-7"
                  onClick={toggleModal}
                >
                  X
                </button>
              </div>
              <div className="flex flex-col flex-auto items-center relative p-4 w-auto xs:overflow-y-auto overflow-y-auto">
                <>
                  {[...history].reverse().map((history, index) => (
                    <div key={index} className="history w-full">
                      <div>
                        <div className="text-theme-color w-full mb-5">
                          Level:{' '}
                          <span className="text-dark-gray dark:text-white">
                            {count--}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <a
                            href={`https://scryfall.com/cards/${history.id}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={
                                history.card_faces === undefined
                                  ? history.image_uris.border_crop
                                  : history.image_uris === undefined
                                  ? history.card_faces[0].image_uris.border_crop
                                  : history.image_uris.border_crop
                              }
                              alt={history.name}
                            />
                          </a>
                        </div>
                      </div>
                      <hr className="bg-theme-color border-0 h-[1px] m-7" />
                    </div>
                  ))}
                </>
              </div>
              <div className="flex flex-wrap flex-shrink-0 justify-end items-center p-3 border-t border-t-dark-gray dark:border-t-white">
                <button
                  className="py-[7px] px-5 flex justify-center flex-row border border-theme-color text-theme-color text-xs uppercase font-extrabold whitespace-nowrap rounded hover:border-dark-gray dark:hover:border-white duration-100 w-26 h-8"
                  onClick={toggleModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
}

export default HistoryModal;
