import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from 'react-native-firebase';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const ref = firebase
  .storage()
  .ref()
  .child('ProfilePic.jpg');
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dp: null,
    };
    this.pickImage = this.pickImage.bind(this);
  }

  componentDidMount() {
    ref.getDownloadURL().then(url => {
      this.setState({dp: url});
    });
  }

  pickImage() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        const imagePath = image.path;
        let imgExt = imagePath.slice(
          imagePath.lastIndexOf('.'),
          imagePath.length,
        );
        const imageRef = firebase
          .storage()
          .ref()
          .child('ProfilePic' + imgExt);
        imageRef.putFile(imagePath).then(image => {
          imageRef.getDownloadURL().then(url => {
            this.setState({dp: url});
          });
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    return (
      <View
        style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View  style={styles.containerContent}>
            <Text style={styles.welcomeText}>
              Welcome to My Application
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.imageView}>
              <Image
                style={styles.image}
                source={{uri: this.state.dp}}
              />
            </View>
            <TouchableOpacity style={styles.btn} onPress={this.pickImage}>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.btnTxt}>Pick image</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default App;
const styles = StyleSheet.create({
   container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      },
   containerContent :  {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
      },
      imageView:{
        backgroundColor: 'white',
        alignSelf: 'center',
        paddingBottom: 40,
      },
     image: {
         width: 150, 
         height: 150, 
         margin: 5, 
         borderRadius: 75},
      welcomeText:   {
          color: '#ff0064', 
          fontSize: 20,
           fontWeight: 'bold'},
  btn: {
    alignSelf: 'center',
    width: 200,
    height: 50,
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: '#ff0064',
  },
  btnTxt: {
    color: '#fff',
  },
  body: {
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  
});
