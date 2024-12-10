import * as React from 'react'

const GetPrompt = ()=>{
    const handleClick = () => {
        alert('this is console'); 
        document.getElementById('para')[0].style.background = 'red'
    }
    return (
        <div>
            <p id="para">This is GetPrompts page</p>
            <div>
                <p>This is paragraph</p>
                <button onClick={()=>handleClick}>Click me</button>
            </div>
        </div>
    )
}
export default GetPrompt