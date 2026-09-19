function onCreatePost()

    for i = 0, getProperty('unspawnNotes.length')-1 do
        setPropertyFromGroup('unspawnNotes',i,'noteSplashData.useRGBShader',false) -- Desactiva el shader RGB en explosiones de notas.
    
    
        setPropertyFromGroup('unspawnNotes',i, 'rgbShader.enabled',false) -- Desactiva el shader RGB en notas no generadas.
    end


    for i = 0,7 do
        setPropertyFromGroup('strumLineNotes',i,'useRGBShader',false) -- Desactiva el shader RGB en notas de strum.
    end
end

function onUpdate()
     for i = 0, getProperty('grpNoteSplashes.length')-1 do
        setPropertyFromGroup('grpNoteSplashes', i, 'offset.x', '-20')
        setPropertyFromGroup('grpNoteSplashes', i, 'offset.y', '-30')
        setPropertyFromGroup('grpNoteSplashes', i, 'scale.x', '0.95')
        setPropertyFromGroup('grpNoteSplashes', i, 'scale.y', '0.95')
        setPropertyFromGroup('grpNoteSplashes', i, 'alpha', 0)
     end
end