import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = React.useState(false);

  const setMapHandler = () => setShowMap((mapPrev) => !mapPrev);

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
          <h2>THE MAP</h2>
        </div>
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
            <Button inverse onClick={setMapHandler}>VIEW ON MAP</Button>
            <Button to={`/place/${props.id}`}>EDIT</Button>
            <Button danger>DELETE</Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
