import React, { Component } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import SpotifyPlayer, { STATUS } from "react-spotify-web-playback";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";
import AudioRecordings from "./AudioRecordings";
import Video from "../assets/video/Lebron.mp4";

const PlaylistContainer = styled.div`
  background: none;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 415px) {
    flex-direction: column;
    height: auto;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
  }

  @media (min-width: 416px) and (max-width: 1300px) {
    align-items: flex-end;
    bottom: 20px;
  }
`;

const HoroscopeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  margin-right: 4vw;
  justify-content: space-between;
  position: relative;
  width: 300px;
  font-family: "Merriweather", serif;

  @media (max-width: 415px) {
    width: 300px;
    margin-right: 0;
    justify-content: flex-start;
    margin-top: 15px;
  }
`;

const HoroscopeVideoContainer = styled.div`
  width: 100%;
  height: 533px;
  background-color: #f8e3b3;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #d2a038;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
  position: relative;

  @media (max-width: 415px) {
    height: 533px;
  }
`;

const PlayButtonContainer = styled.div`
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HoroscopeSign = styled.p`
  text-transform: capitalize;
  text-align: center;
  font-weight: 700;
`;

const HoroscopeText = styled.p`
  text-align: center;
  line-height: 1.2;

  @media (max-width: 415px) {
    line-height: 1;
  }
`;

const WebPlaylistInfo = styled.div`
  display: flex;
  width: 30vw;
  flex-direction: column;
  justify-content: space-between;
  height: 80vh;
  font-family: "Merriweather", serif;

  @media (max-width: 415px) {
    width: 80vw;
    height: auto;
    margin-top: 25px;
  }
`;

const WebSongDetailsContainer = styled.div`
  height: 90%;
  overflow-y: scroll;
  border-radius: 10px;
  border: 2px solid #d2a038;
  background-color: #f8e3b3;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 415px) {
    height: 35vh;
    margin-bottom: 20px;
    border: 0px solid black;
  }
`;

const CurrentSong = styled.p`
  color: black;
  font-weight: 700;
`;

const SongContainer = styled.div`
  display: flex;
  width: 90%;
  margin-left: 5%;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #000;
`;

const Song = styled.p`
  color: #474747;
  font-weight: 400;
`;

const ZodiacSignContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ZodiacSign = styled.p`
  color: black;
  font-weight: 700;
  padding-left: 10px;
  margin: 15px 0;
  padding-bottom: 5px;
  text-transform: capitalize;

  @media (max-width: 415px) {
    border: 0px solid black;
  }
`;

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 20px;
`;

const Player = styled.div`
  width: 100%;
`;

const ShareContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;

  @media (max-width: 1300px) {
    flex-direction: column-reverse;
  }
`;

const SocialMediaIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 7px;
  transition: ease-out 0.3s;

  :hover {
    background-color: #d2a038;
  }

  .icon-text {
    color: white;
    font-family: "Merriweather", serif;
    margin: 0 auto;
  }
`;

const SocialMediaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .share-text {
    font-family: "Merriweather", serif
    margin: 0 25px 0 0;
  }

  @media (min-width: 416px) and (max-width: 675px) {
    justify-content: center;

    .share-text {
      display: none;
    }

  }

  @media (max-width: 1300px) {
    margin-bottom: 10px;
  }


`;

class Playlist extends Component {
  constructor(props) {
    super(props);

    const sign = props.playlist.sign;
    const audio =
      AudioRecordings[sign.toLowerCase()][Math.floor(Math.random() * 2)];

    this.audio = new Audio(audio.track);

    this.state = {
      deviceId: undefined,
      currentURI: props.playlist.tracks[0].uri,
      startPlayingMusic: false,
      recordingAudioIsPlaying: false,
      videoIsPlaying: false,
      signTranscript: audio.transcript
    };
  }

  componentWillMount = async () => {};

  componentDidMount = () => {
    try {
      this.audio.play();
    } catch (e) {
      console.log(e);
    }

    this.audio.addEventListener("ended", () => {
      this.setState({
        startPlayingMusic: true
      });
    });
    this.audio.addEventListener("play", () => {
      this.setState({
        recordingAudioIsPlaying: true,
        videoIsPlaying: true
      });
    });
  };

  componentWillUnmount() {
    this.audio.removeEventListener("ended", () =>
      this.setState({ audioIsPlaying: false })
    );
  }

  saveSpotifyPlaylist = async () => {
    const { serverUrl, accessToken, userId, playlist } = this.props;

    const url = serverUrl + "/playlist/save";

    await axios({
      method: "POST",
      url,
      data: {
        access_token: accessToken,
        user_id: userId,
        playlist_id: playlist.playlist_id
      }
    })
      .then(res => {
        // Redirect to share screen
      })
      .catch(err => {
        // Handle error
        console.log(err);
      });
  };

  togglePlayingMusic = () => {
    this.setState({ startPlayingMusic: !this.state.startPlayingMusic });
  };

  getMobileDeviceId = async () => {
    let deviceId;
    const { serverUrl, accessToken } = this.props;
    const url = serverUrl + "/player/devices";

    await axios({
      method: "GET",
      url,
      params: { access_token: accessToken }
    })
      .then(res => {
        let devices = res.data.devices;
        for (let i = 0; i < devices.length; i++) {
          let device = devices[i];
          if (device.type === "Smartphone") {
            deviceId = device.id;
            return;
          }
        }
      })
      .catch(err => console.log(err));

    return deviceId;
  };

  renderPlaylistSongNames = () => {
    const { playlist } = this.props;
    const { currentURI } = this.state;

    return playlist.tracks.map((song, i) => {
      if (song.uri === currentURI) {
        return (
          <SongContainer key={i}>
            <CurrentSong>{song.name}</CurrentSong>
            <FaPlay />
          </SongContainer>
        );
      } else {
        return (
          <SongContainer key={i}>
            <Song>{song.name}</Song>
            <FaPlay />
          </SongContainer>
        );
      }
    });
  };

  renderMobileStream = () => {
    const {
      currentURI,
      signTranscript,
      recordingAudioIsPlaying,
      videoIsPlaying
    } = this.state;
    const { playlist } = this.props;

    return (
      <PlaylistContainer>
        <HoroscopeContainer>
          <HoroscopeSign>TI HOROSCOPE APP</HoroscopeSign>
          <HoroscopeVideoContainer>
            <ReactPlayer
              className="react-player"
              url={Video}
              style={{}}
              playing={videoIsPlaying}
              width="100%"
              height="100%"
              controls={false}
            />
            {!recordingAudioIsPlaying ? (
              <PlayButtonContainer>
                <FaPlay
                  style={{ cursor: "pointer" }}
                  size={48}
                  onClick={() => {
                    this.audio.play();
                  }}
                />
              </PlayButtonContainer>
            ) : null}
          </HoroscopeVideoContainer>
          <HoroscopeSign>{playlist.sign}</HoroscopeSign>
          <HoroscopeText>{signTranscript}</HoroscopeText>
        </HoroscopeContainer>

        <WebPlaylistInfo>
          <ZodiacSignContainer>
            <ZodiacSign>{`${playlist.sign} Horoscope Playlist`}</ZodiacSign>
          </ZodiacSignContainer>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20
            }}
          >
            <FacebookShareButton
              url={`https://www.starsignsbyti.com/playlist/${playlist.sign}`}
              quote={"Stream The Libra Now"}
              hashtag="#TheLibra"
              className="social-media-btn"
            >
              <SocialMediaIcon>
                <p className="icon-text">F</p>
              </SocialMediaIcon>
            </FacebookShareButton>
            <TwitterShareButton
              url={`https://www.starsignsbyti.com/playlist/${playlist.sign}`}
              title={`Get your personalized horoscope from T.I.`}
              hashtag={["#TheLibra"]}
              related={["tip"]}
              className="social-media-btn"
            >
              <SocialMediaIcon>
                <p className="icon-text">T</p>
              </SocialMediaIcon>
            </TwitterShareButton>
          </div>

          <WebSongDetailsContainer>
            <iframe
              src={`https://open.spotify.com/embed/playlist/${playlist.playlist_id}`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="encrypted-media"
            ></iframe>
          </WebSongDetailsContainer>
          <button
            className="btn save-btn"
            onClick={() => {
              this.saveSpotifyPlaylist();
            }}
          >
            Save to Spotify
          </button>

          <PlayerContainer></PlayerContainer>
        </WebPlaylistInfo>
      </PlaylistContainer>
    );
  };

  renderDesktopStream = () => {
    const {
      startPlayingMusic,
      recordingAudioIsPlaying,
      signTranscript,
      videoIsPlaying
    } = this.state;
    const { playlist, accessToken } = this.props;

    let tracks = playlist.tracks.map(track => {
      return track.uri;
    });

    return (
      <PlaylistContainer>
        <HoroscopeContainer>
          <HoroscopeVideoContainer>
            <ReactPlayer
              className="react-player"
              url={Video}
              style={{}}
              playing={videoIsPlaying}
              width="100%"
              height="100%"
              controls={false}
            />
            {!recordingAudioIsPlaying ? (
              <PlayButtonContainer>
                <FaPlay
                  style={{ cursor: "pointer" }}
                  size={48}
                  onClick={() => {
                    this.audio.play();
                  }}
                />
              </PlayButtonContainer>
            ) : null}
          </HoroscopeVideoContainer>

          <HoroscopeSign>{playlist.sign}</HoroscopeSign>
          <HoroscopeText>{signTranscript}</HoroscopeText>
        </HoroscopeContainer>

        <WebPlaylistInfo>
          <WebSongDetailsContainer>
            <ZodiacSignContainer>
              <ZodiacSign>{`${playlist.sign} Horoscope Playlist`}</ZodiacSign>
            </ZodiacSignContainer>
            {this.renderPlaylistSongNames()}
          </WebSongDetailsContainer>

          <PlayerContainer>
            <ShareContainer>
              <button
                className="save-btn"
                onClick={() => {
                  this.saveSpotifyPlaylist();
                }}
              >
                Save Playlist
              </button>
              <SocialMediaContainer>
                <p className="share-text">Share Playlist</p>
                <div>
                  <FacebookShareButton
                    url={`https://www.starsignsbyti.com/playlist/${playlist.sign}`}
                    quote={"Stream The Libra Now"}
                    hashtag="#TheLibra"
                    className="social-media-btn"
                  >
                    <SocialMediaIcon>
                      <p className="icon-text">F</p>
                    </SocialMediaIcon>
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={`https://www.starsignsbyti.com/playlist/${playlist.sign}`}
                    title={`Get your personalized horoscope from T.I.`}
                    hashtag={["#TheLibra"]}
                    related={["tip"]}
                    className="social-media-btn"
                  >
                    <SocialMediaIcon>
                      <p className="icon-text">T</p>
                    </SocialMediaIcon>
                  </TwitterShareButton>
                </div>
              </SocialMediaContainer>
            </ShareContainer>
            <Player>
              <SpotifyPlayer
                name={"Spotify Web (The Libra)"}
                token={accessToken}
                uris={tracks}
                // autoPlay={true}
                play={startPlayingMusic}
                persistDeviceSelection
                syncExternalDevice
                styles={{
                  bgColor: "#f8e3b3",
                  sliderColor: "#d2a038",
                  sliderHandleColor: "#d2a038",
                  sliderTrackColor: "#000",
                  trackArtistColor: "#d2a038"
                }}
              />
            </Player>
          </PlayerContainer>
        </WebPlaylistInfo>
      </PlaylistContainer>
    );
  };

  trackSpotifyState = () => {
    const { accessToken, serverUrl } = this.props;

    const updateState = setInterval(() => {
      const url = serverUrl + "/player";

      axios({
        method: "GET",
        url,
        params: { device_id: this.state.deviceId, access_token: accessToken }
      })
        .then(res => {
          let state = res.data;

          const currentURI = state.item.uri;

          if (currentURI !== this.state.currentURI) {
            console.log(state);
            this.setState({ currentURI });
          }
        })
        .catch(err => {
          window.location.reload();
        });
    }, 1000);
  };

  render() {
    {
      if (isMobile) {
        {
          return this.renderMobileStream();
        }
      } else {
        return this.renderDesktopStream();
      }
    }
  }
}

export default Playlist;
