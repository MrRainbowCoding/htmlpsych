local cameraBopIntensity = 1


function onCreatePost()
    setProperty('camZoomingMult', 0)
    setProperty('camZooming', true)
end

function onEvent(name, value1, value2)
    if name == "Set Camera Bop" then
        local newIntensity = tonumber(value2)
        if newIntensity then
            cameraBopIntensity = newIntensity
        end
    end
end

function onBeatHit()
    if cameraBopIntensity > 0 then
        triggerEvent('Add Camera Zoom', tostring(0.015 * cameraBopIntensity), tostring(0.03 * cameraBopIntensity))
    end
end