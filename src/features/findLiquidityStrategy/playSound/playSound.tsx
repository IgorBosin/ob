import React, {useEffect} from 'react';
import soundFile from "utils/soundFiles/sound.mp3";
import {useDispatch, useSelector} from "react-redux";
import {selectPlaySound} from "app/app.selector";
import {playSound} from "app/app.slice";

const PlaySound = () => {
  const isSound = useSelector(selectPlaySound)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isSound) {
      const audio = new Audio(soundFile);
      audio.volume = 0.1
      audio.play();
      dispatch(playSound({playSound: false}))
    }
  }, [isSound]);

  return (
    <div>

    </div>
  );
};

export default PlaySound;
