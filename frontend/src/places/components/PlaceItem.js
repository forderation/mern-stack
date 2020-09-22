import React, { useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import "./PlaceItem.css";
import { AuthContext } from "../../context/auth-context";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = React.useState(false);
  const authContext = useContext(AuthContext);

  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const setMapHandler = () => setShowMap((mapPrev) => !mapPrev);
  const setConfirmModalHandler = () =>
    setShowConfirmModal((prevModal) => !prevModal);
  const deleteConfirmHandler = () => {
    console.log("Deleting ... ");
  };
  return (
    <React.Fragment>
      <Modal
        show={showMap}
        onClick={setMapHandler}
        header={props.address}
        contentClass="place-item___modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={setMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onClick={setConfirmModalHandler}
        header="Are you sure ?"
        contentClass="place-item___modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={setConfirmModalHandler}>
              Cancel
            </Button>
            <Button danger onClick={deleteConfirmHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={setMapHandler}>
              VIEW ON MAP
            </Button>
            {authContext.isLoggedIn && (
              <React.Fragment>
                <Button to={`/place/${props.id}`}>EDIT</Button>
                <Button danger onClick={setConfirmModalHandler}>
                  DELETE
                </Button>{" "}
              </React.Fragment>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
