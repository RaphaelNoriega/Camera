
import React,{Component} from 'react';
//import React, { PureComponent } from 'react';
import { StyleSheet, Text,Image, TouchableOpacity,Modal, View,PermissionsAndroid, Dimensions,ScrollView, FlatList } from 'react-native';
import {RNCamera} from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";

export default class App extends Component {

  constructor() {
    super(...arguments);
    this.state = { 
      image: '',
      imageCount:0,
      fotosLista: [],
      modalVisible: false,
      data:[],
      showFoto: false,
    }
  }
  
  render() {

    return (
      
      <View style={styles.container}>

        {/*<Modal
          animationType='slide'
          transparent
          visible={this.state.modalVisible}
          onRequestClose={this.toggleModalVisibility}
        >
          <View style={styles.modalContainer}>
            <ScrollView>
              {this.state.imagesList.map(image =>(
                <Image
                  source={{uri:image.node.image.uri}}
                  key={{uri: image.node.image.uri}}
                  style={styles.modalImage}
                  resizeMode='contain' 
                />
              ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={this.toggleModalVisibility} style={styles.capture}>
                <Text style={{ fontSize: 14 }}> cerrar galeria </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        */}

        {this.toggleScreen()}  

        {this.state.showFoto === true ? 
        <View>
          {this.state.fotosLista.map(i =>(
            <>
            <ScrollView> 
              <Text style={{color:'#fff'}}>{i.node.image.uri}</Text>
              <Image style={{
                          width: 200,
                          height: 100,
                          alignItems:'center'
                        }}
                        source={{uri: i.node.image.uri}}/>
            </ScrollView>
            </>
          ))}
        </View>
        :
          null
        }
               
      </View>
      
    );
  }

  takePicture = async () => {
    
    if (this.camera) {
      try{
        const options = { 
          quality: 0.3,
          base64: true,
          //ratio: "3:2",
          //flashMode={RNCamera.Constants.FlashMode.off}
          
        };
        const data = await this.camera.takePictureAsync(options);
        alert(data.uri);
        console.log(data.uri);
  
        this.setState({image:data.uri});
      }catch(err){
        alert(err);
      }
      
    }
  };


  //ya se estan guardando en el telefono las fotos!!!! perfecto!
  saveImage = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Necesitamos permiso para guardar en dispositivo " +
            "las imagenes.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Puedes guardar fotos en el telefono");
        CameraRoll.save(this.state.image);
        const {imageCount} = this.state;
        this.setState({image:'',imageCount: imageCount + 1},()=>alert('se guardo imagen con exito'))
      } else {
        console.log("No tienes permiso de guardar Fotos en el dispositivo");
      }
    } catch (err) {
      console.warn(err);
    }
  }


  newImage =()=>{
    this.setState({image: ''},()=>alert('imagen actualizada correctamente'))
  }


  //ok esta onda funciona muy bien, solo habria que guardar las fotos en el asyncstorage
  //es decir lo mas dificil era buscar como las guardaba en el telefono, de ahi se ya se save la direccion, de la cual tomaremos
  //OJO de hecho las guarda en el telefono, deja checo eso,SI!, SI LAS GUARDA, lo que queda es ver como renombrarlas y como 
  //las podemos guardar en otra carpeta, y despues vemos el como borrarlas, que de hecho tiene una funcion que hace eso la libreira
  //todo va muy bien hasta ahora, ya tengo los mapas, la impresora ahi va en camino y una vez que tenga la camara, todo estara perfecto
  //
  showPhoto = async ()=>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Permisos para ver imagenes",
          message:
            "Necesitamos permiso para ver las imagens en el dispositivo " +
            "movil.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Puedes ver las fotos del telefono");
        
            CameraRoll.getPhotos({
              first: this.state.imageCount,
              assetType: 'Photos',
            })
            .then(res => {
              this.setState({ fotosLista: res.edges ,showFoto: true},()=>console.log(this.state.fotosLista));
            })
            .catch((error) => {
              console.log(error);
            });
        
      } else {
        console.log("No tienes permiso de ver Fotos del dispositivo");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  //rafael: ya te lo habia dicho pero, te lo repito, eres la ostia tio!
  //rafael: si de hecho estoy conciente de eso, pero gracias por recordarmelo

  /**
   * para la calida de la foto solo se toma la la propiedad de ratio={4:3} es el valor por default
   * esto genera una imagen con una dimencion de 480x720 y un peso aproximadamente de 47.3KB - 50KB
   * se le puede agregar mas calidad a la imagen pero primero probaremos de esta forma a ver si  es optimo
   */
  toggleScreen=()=>{
    
    if(this.state.image === ''){
      return(
        <View style={styles.cameraContainer}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          ratio={"3:2"}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}     
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Toma Foto </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.showPhoto} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Ver Fotos </Text>
          </TouchableOpacity>
        </View>
      </View>
      )
    }else{
      return(
        <View style={styles.container}>
        <Text style={{color:'#fff'}}>muestra la imagen que se tomo y los botones</Text>
        <Image source={{uri: this.state.image}} style={styles.image} resizeMode='contain' />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.saveImage} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Guardar </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.newImage} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Nueva imagen </Text>
          </TouchableOpacity>
          
        </View>
      </View>
      )
    }
  }
  

};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#ff5722'
  },
  cameraContainer: {
    flex: 4,
    flexDirection: 'column',
    backgroundColor: '#ff5722',
  },
  buttonContainer:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fdd835',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 10,
    alignSelf: 'auto',
    margin: 1,
    marginTop:80
  },
  image:{
    flex:1
  },
  
  
});
