import React, {useState} from 'react'
import "./VideoUploader.scss";

const VideoUploader = () => {
    const [defaultImg, setDefaultImg] = useState(
        `${process.env.PUBLIC_URL}/assets/default-img/default-image.jpg`
      );
    const [videoFile, setVideoFile] = useState({
      fileObject: "",
      preview_URL: `${process.env.PUBLIC_URL}/assets/default-img/default-image.jpg`,
      type: "image"
    });
  
    let inputRef;
  
    const saveVideoImage = (e) => {
      e.preventDefault();
      // 미리보기 url 만들기
      // 파일이 존재하면 file 읽기
      if (e.target.files[0]) {
        // 새로운 파일 올리면 createObjectURL()을 통해 생성한 기존 URL을 폐기
        URL.revokeObjectURL(videoFile.preview_URL);
        // 새로운 미리보기 URL 생성
        const preview_URL = URL.createObjectURL(e.target.files[0]);
        const fileType = e.target.files[0].type.split("/")[0];
        // video일 때 시간 제한 15초
        if (fileType === "video") {
          let videoElement = document.createElement("video");
          videoElement.src = preview_URL;
          /*
            video 길이 제한!
            videoElement의 readyState가 4면 비디오가 로딩이 된 것이므로 길이를 판별할 수 있다
            video가 재생할 수 있는 상태로 만드는 과정이 비동기적으로 실행되기 때문에
            setInterval로 비디오가 로딩된 상태가 될 때까지 계속 확인하면서 기다려준다
          */
          const timer = setInterval(() => {
            if (videoElement.readyState == 4) {
              if (videoElement.duration > 16) {
                alert("동영상의 길이가 16초보다 길면 안됩니다");
                // src에 넣지 않을 것이므로 미리보기 URL 제거
                URL.revokeObjectURL(preview_URL);
              } else {
                setVideoFile(
                  {
                    fileObject: e.target.files[0],
                    preview_URL: preview_URL,
                    type: fileType
                  }
                )
              }
              clearInterval(timer);
            }
          }, 500);
        } else { // image일 땐 시간제한이 없으므로 그냥 상태에 넣어줌
          setVideoFile(
            {
              fileObject: e.target.files[0],
              preview_URL: preview_URL,
              type: fileType
            }
          )
        }
      }
    }
    //  상태 초기화하기
    const deleteVideoImage = () => {
      // createObjectURL()을 통해 생성한 기존 URL을 폐기
      URL.revokeObjectURL(videoFile.preview_URL);
      setVideoFile({
        fileObject: "",
        preview_URL: `${process.env.PUBLIC_URL}/assets/default-img/default-image.jpg`,
        type: "image"
      });
    }
  
    return (
      <div className="uploader-wrapper">
        <input
          type="file" accept="video/*, image/*"
          id="video"
          onChange={saveVideoImage}
          // 클릭할 때 마다 file input의 value를 초기화 하지 않으면 버그가 발생할 수 있다
          // 사진 등록을 두개 띄우고 첫번째에 사진을 올리고 지우고 두번째에 같은 사진을 올리면 그 값이 남아있음!
          onClick={(e) => e.target.value = null}
          ref={refParam => inputRef = refParam}
          style={{display: "none"}}
        />
        <div className="file-wrapper">
          {videoFile.type === "image" ?
            <img alt="" src={videoFile.preview_URL} style={{width:"300px", height:"300px", ObjectFit:"contain"}} /> :
            <video controls={true} autoPlay={true} src={videoFile.preview_URL}/>
          }
        </div>
        <div className="upload-button">
          <button variant="contained" onClick={() => inputRef.click()}>
            영상업로드
          </button>
          <button variant="contained" color="error" onClick={deleteVideoImage}>
            삭제
          </button>
        </div>
      </div>
    );
  }
  
  export default VideoUploader;