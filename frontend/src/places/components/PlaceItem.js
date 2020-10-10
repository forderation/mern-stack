import React, { useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import "./PlaceItem.css";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHistory } from "react-router-dom";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = React.useState(false);
  const { loadingState, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const setMapHandler = () => setShowMap((mapPrev) => !mapPrev);
  const setConfirmModalHandler = () =>
    setShowConfirmModal((prevModal) => !prevModal);
  const deleteConfirmHandler = async () => {
    setConfirmModalHandler();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + authContext.token }
      );
      props.deletePlace(props.id);
    } catch (err) {}
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {loadingState && <LoadingSpinner asOverlay />}
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
            {!loadingState && (
              <Button danger onClick={deleteConfirmHandler}>
                Delete
              </Button>
            )}
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
            <img
              src={`${process.env.REACT_APP_BACKEND_BASE}/${props.image}`}
              alt={props.title}
            />
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
            {authContext.isLoggedIn && authContext.userId === props.creator && (
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
