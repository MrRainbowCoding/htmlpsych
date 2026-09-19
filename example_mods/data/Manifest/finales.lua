local songEnded = false

function onCreate()
    precacheImage('endings/redux-end-nut')
    precacheImage('endings/redux-end-bad')
    precacheImage('endings/redux-end-good')
end

function onEndSong()
    if not songEnded and isStoryMode then
        songEnded = true

        local acc = getProperty('ratingPercent') * 100

        if acc < 45 then
            showEnding('endings/redux-end-nut', 'badEnding', 8)
            elseif acc < 40 then
            showEnding('endings/redux-end-worst', 'badEnding', 7)
            
        elseif acc < 80 then
            showEnding('endings/redux-end-bad', 'badEnding', 7)
            
        else
            showEnding('endings/redux-end-good', 'goodEnding', 7)
        end

        return Function_Stop
    end
    return Function_Continue
end

function showEnding(imageName, musicName, timeEngine)
    makeLuaSprite('ending', imageName, 0, 0)
    setObjectCamera('ending', 'other')
    screenCenter('ending')
    addLuaSprite('ending', true)
    setProperty('ending.alpha', 1)
    playMusic(musicName, 1, true)
    runTimer('exit', timeEngine)
end

function onTimerCompleted(tag)
    if tag == 'exit' then
        exitSong()
    end
end
