import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectPlaySound } from '@/app.selector'
import { playSound } from '@/app.slice'

import musicalAlert from './soundFiles/musicalAlert.mp3'

const PlaySound = () => {
  const isSound = useSelector(selectPlaySound)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isSound) {
      const audio = new Audio(musicalAlert)

      audio.volume = 1
      audio.play()
      dispatch(playSound({ playSound: false }))
    }
  }, [dispatch, isSound])

  return <div></div>
}

export default PlaySound
