import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Redirect } from 'react-router';
import { getFeatureVector, getFVDistance } from '../facerecognition/FaceRecognition';
import swal from '@sweetalert/with-react';
import {isIOS, isSafari} from 'react-device-detect';
import ImageUploader from 'react-images-upload';
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";

const cookies = new Cookies();

class ChangePicture extends React.Component {

    state = {
        redirect : false,
        picture: null,
        calculating: false,
        featureVector: null,
        image: null
    };

    setRedirect = () => {
        this.setState({redirect: true})
    };

    renderRedirect = () => {
        if (this.state.redirect) {return <Redirect to="/sign-in" />}
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
          this.image = dataUri;
          this.featureVector = fv;
          this.context.emit("getFVById", {token: cookies.get("token")});
        }
    }

    componentDidMount() {

      this.context.on("sentFVById", (oldFv) => {
        let dist = getFVDistance(this.featureVector, Object.values(JSON.parse(oldFv)) );
        if (dist <= 0.52) {
          this.context.emit("newImage", {token: cookies.get("token"), img: this.image });
          swal({
              title: "Picture Uploaded!",
              text: "Your picture has been updated!",
              icon: "success",
              button: "perfect!",
          });
          this.setRedirect();
        }
        else {
          swal({
              title: "uploading FAILED",
              text: "The person in the new picture doesn't match the old one!",
              icon: "warning",
              button: "try again",
          });
          this.setState({calculating:false});
        }
      });

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
                  <div className="polaroid" style={{width:'300px'}}>
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
ChangePicture.contextType = SocketContext;

export default ChangePicture;
