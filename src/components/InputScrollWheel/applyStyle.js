export function applyStyle(scrollerId, itemInSelectorArea, dataLen, style){
    var style = style || 'flat'

    switch(style){
        case 'flat':
            var topShadeItem = itemInSelectorArea 
            var topFade = 1
            while(topShadeItem >= 0){
                document.getElementById(`${scrollerId}-scroll-item--${topShadeItem}`).style.transition = `all 0.3s`
                document.getElementById(`${scrollerId}-scroll-item--${topShadeItem}`).style.opacity = `${topFade}`
                topFade -= 0.333333
                topShadeItem--
            }

            document.getElementById(`${scrollerId}-scroll-item--${itemInSelectorArea}`).style.opacity = `1`
            
            var bottomFade = 0.66666
            var bottomShade = itemInSelectorArea + 1
            for(var i=bottomShade; i< dataLen; i++){
                document.getElementById(`${scrollerId}-scroll-item--${i}`).style.transition = `all 0.3s`
                document.getElementById(`${scrollerId}-scroll-item--${i}`).style.opacity = `${bottomFade}`
                bottomFade -= 0.33333
            }
            break;
        
        default: // flat
            var topShadeItem = itemInSelectorArea 
            var topFade = 1
            var topRotate = 50
            while(topShadeItem >= 0){
                document.getElementById(`${scrollerId}-scroll-item--${topShadeItem}`).style.transition = `all 0.3s`
                document.getElementById(`${scrollerId}-scroll-item--${topShadeItem}`).style.opacity = `${topFade}`
                document.getElementById(`${scrollerId}-scroll-item--${topShadeItem}`).style.transform = `rotateY()`
                topFade -= 0.333333

                topShadeItem--
            }

            var bottomFade = 0.66666
            var bottomShade = itemInSelectorArea + 1
            for(i=bottomShade; i< dataLen; i++){
                document.getElementById(`${scrollerId}-scroll-item--${i}`).style.transition = `all 0.3s`
                document.getElementById(`${scrollerId}-scroll-item--${i}`).style.opacity = `${bottomFade}`
                bottomFade -= 0.33333
            }
            break;
    }
}