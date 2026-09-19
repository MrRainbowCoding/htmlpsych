local cameras = {'camOther','camHUD', "camGame"}
camera = {'camGame','camHUD'}
screen = {nil, nil}
offset = {nil, nil}




function onUpdatePost()
    for i, cam in pairs(camera) do
        for ii,wh in pairs({'width', 'height'}) do
            setProperty(cam..'.'..(ii == 1 and 'x' or 'y'), (-((screen[ii] or getPropertyFromClass('openfl.Lib', 'application.window.display.bounds.'..wh)) + (ii == 1 and -1280 or -720)) / 2) + (offset[ii] or 0))
            setProperty(cam..'.'..wh, screen[ii] or getPropertyFromClass('openfl.Lib', 'application.window.display.bounds.'..wh))
        
            if cam:lower() == 'camgame' then
                setProperty('camGame.targetOffset.'..(ii == 1 and 'x' or 'y'), -((screen[ii] or getPropertyFromClass('openfl.Lib', 'application.window.display.bounds.'..wh)) + (ii == 1 and -1280 or -720)) / 2)
            elseif cam:lower() == 'camhud' then
                setProperty('camHUD.'..(ii == 1 and 'x' or 'y'), 0)
            end
        end

        if cam:lower() == 'camother' then
            setProperty('camOther.y', (-(getPropertyFromClass('openfl.Lib', 'application.window.display.bounds.height')-720) / 2) + 80)
        end
    end
    
	for _,camera in ipairs(cameras) do
		setProperty(camera .. ".flashSprite.scaleX", 1.2)
		setProperty(camera .. ".flashSprite.scaleY", 1.2)


		local scale = getProperty(camera .. ".zoom") / 1.15
		callMethod(camera .. ".setScale", {scale, scale})
	end
end