import React, { useRef, useEffect, useState } from "react";
import Button from "./Button";
import "./ImageUpload.css";
const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setValid] = useState(false);

  const pickedHandler = (event) => {
    filePickerHandler(event);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const filePickerHandler = (event) => {
    let pickedFile;
    let valid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setValid(true);
      valid = true;
    } else {
      setValid(false);
      valid = false;
    }
    props.onInput(props.id, pickedFile, valid);
  };
  return (
    <div className="form-control">
      <input
        type="file"
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && `center`}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p style={{ color: 'red' }}>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
