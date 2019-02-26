import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Redirect } from 'react-router';
import { getFeatureVector } from '../facerecognition/FaceRecognition';
import swal from '@sweetalert/with-react';
import {isIOS, isSafari} from 'react-device-detect';
import ImageUploader from 'react-images-upload';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class CameraComp extends React.Component {

    state = {
        redirect : false,
        picture: null,
        calculating: false
    };

    setRedirect = () => {
        this.setState({redirect: true})
    };

    renderRedirect = () => {
        if (this.state.redirect) {return <Redirect to="/imageConfirm" />}
    };

    async onTakePhoto (dataUri, iosPhoto) {
        this.setState({ calculating: true});
        let photo = new Image;
        if (iosPhoto == null) {
          let photoSrc = dataUri;
          photo.src = photoSrc;
        }
        else { photo = iosPhoto }
        console.log(photo);
        let fv = await getFeatureVector(photo);

        if (fv === null) {
          console.log("No face detected!");
          swal({
              title: "No face detected",
              text: "Make sure you are facing the camera with good lighting conditions.",
              icon: "warning",
              button: "I'll try!",
          });
          this.setState({ calculating: false});
        }
        else {
          localStorage.setItem("PhotoOfMe", dataUri);
          localStorage.setItem("fv", JSON.stringify(fv));
          this.setRedirect();
        }

    }

    redirect() {
        return <Redirect to="/view"/>;
    }

    handleUpload(picture) {
        //TODO: Handle image upload.
        if (picture.toString() !== "") {
            // Picture uploaded.
            this.onTakePhoto(null, picture)
            // TODO: Make sure to redirect.
        }
        else {
            // Error, either too big or
            swal("Make sure the picture is jpg or png and smaller than 5MB.")
        }
    }

    showInfo() {
        swal("Why am I seeing this page?", "Since you are using an iOS device, the camera component is not" +
        " compatible with the web app. That's why we are offering you a way to choose a photo from your camera roll.")
    }


    render () {
      if (isSafari || isIOS) return (
          <div>
              <p className="subTitle">Upload an image</p>
              <span style={{margin:'10px'}}> </span>
              <div className="polaroid" style={{width:'500px'}}>
                  <ImageUploader
                      withIcon={true}
                      buttonText='Choose profile image'
                      onChange={this.handleUpload}
                      imgExtension={['.jpg', '.png']}
                      maxFileSize={5242880}
                      withLabel={false}
                      fileSizeError={"Make sure it is smaller than 5MB."}
                      fileTypeError={"Make sure it is a jpg or png image."}
                      singleImage={true}
                  />
              </div>
              <button className="smallButton info" style={{marginTop:'20px'}} onClick={this.showInfo}> </button>
          </div>
    );

    return (
      <div className="background">
        {this.renderRedirect()}
        <p className="subTitle">Take your profile picture</p>
          {!this.state.calculating && <div className="polaroid">
            <Camera
                onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri, null); } }
                isImageMirror = {true}
                imageType = {'IMAGE_TYPES.PNG'}
                imageCompression = {0.97}
            />
            </div>}
          {this.state.calculating && <div className="polaroid">
              <div className="cameraLoader"></div>
              <p>Detecting face. This can take up to 30 seconds.</p>
          </div>}
      </div>
    );
    }
}

export default CameraComp;
