import React, { useEffect } from 'react';
import ReactDom from 'react-dom';

function HistoryModal({ modalOpen, closeModal, history }) {
  useEffect(() => {
    const closeOnEscapeKey = (e) => (e.key === 'Escape' ? closeModal() : null);
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [closeModal]);

  if (!modalOpen) return null;

  let count = history.length;

  return ReactDom.createPortal(
    <div className="bg-black bg-opacity-70 fixed top-0 left-0 overflow-x-hidden overflow-y-auto block w-full h-full">
      <div className="flex items-center relative transform-none w-screen max-w-none h-full min-h-[calc(100%-1rem)] m-0 sm:mt-7 sm:max-w-lg sm:w-auto sm:m-auto sm:min-h-[calc(100%-3.5rem)] sm:h-[calc(100%-3.5rem)] lg:max-w-3xl">
        <div className="flex flex-col relative bg-clip-padding bg-light-grey rounded xs:rounded-none w-full xs:h-full md:w-[50rem] max-h-full overflow-hidden">
          <div className="flex flex-shrink-0 border-b border-b-white w-full p-4 justify-between items-center text-xl font-bold text-light-purple">
            <h3>History</h3>
            <button
              type="button"
              className="flex justify-center flex-row text-light-grey bg-light-purple bg-opacity-60 rounded cursor-pointer hover:bg-opacity-80 duration-200 w-7 h-7"
              onClick={closeModal}
            >
              X
            </button>
          </div>
          <div className="modal-content flex flex-col flex-auto items-center relative p-4 w-auto xs:overflow-y-auto overflow-y-auto">
            <>
              {[...history].reverse().map((history) => (
                <div key={history.id} className="history w-full">
                  <div>
                    <div className="text-light-purple w-full mb-5">
                      Level: <span className="text-white">{count--}</span>
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
                  <hr className="test bg-light-purple border-0 h-[1px] m-7" />
                </div>
              ))}
            </>
          </div>
          <div className="flex flex-wrap flex-shrink-0 justify-end items-center p-3 border-t border-t-white">
            <button
              className="py-1.5 px-5 flex justify-center flex-row border border-light-purple text-light-purple bg-light-grey rounded cursor-pointer hover:border-white duration-200 w-26 h-9"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal')
  );
}

export default HistoryModal;
