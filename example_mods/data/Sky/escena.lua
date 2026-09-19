local allowCountdown = false
function onCreate()
		if not allowCountdown and isStoryMode then
	
		setProperty('camGame.alpha',0)
		setProperty('camHUD.alpha',0)
    
		
	end
end

function onStartCountdown()
	if not allowCountdown and isStoryMode then
 startVideo('ay/sky');
 allowCountdown = true;
 return Function_Stop;
 end
 runTimer('blackDelay', 1)
 
 end
 
 function onTimerCompleted(tag)
	if tag == 'blackDelay' then
	
		
		doTweenAlpha('cgTwn', 'camGame', 1, 0.5, 'sineOut');
		doTweenAlpha('chTwn', 'camHUD', 1, 0.5, 'sineOut');
	end
end

