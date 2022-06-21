'use strict'

import {useRef} from "react";
const React = require('react');
const ReactDOM = require('react-dom');
const {useState, useEffect} = require("react");
const axios = require("axios");
import imgFanUrl from "../resources/static/image/fan.png";

function App(props) {
    const settingName ='default';
    const [fanSettings, setFanSettings] =useState({fanSettingsId: 0, name: settingName, speed: 0, direction: 0});
    const [needUpdate, setNeedUpdate] =useState(false);
    const imgRef =useRef(null);
    const rotation = useRef(0);
    const myCanvasSpeed =useRef(null);
    const myCanvasDirection =useRef(null);
    const mySpeedMouseActions =useRef({mousedown: false, initial_y: -1, mousedragged:false});
    const myDirectionMouseActions =useRef({mousedown: false, initial_y: -1, mousedragged:false});
    
    // on page load
    useEffect(() => {
        [
            { canvas: myCanvasSpeed.current },
            { canvas: myCanvasDirection.current },
        ].map((o) => {
            drawCords({canvas: o.canvas, pulled: false});
        })
        
        // imgRef.src = { imgFanUrl };
        
        // retrieve the current settings from Mysql db on page load
        fetch('/fansettings/?name=' + settingName)
            .then(res => res.json())
            .then(data => {
                setFanSettings(data);
                setRotationTimer(data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    
    // update db when settings have been changed
    useEffect(() => {
        if(needUpdate) {
            updateFanSettings();
            setRotationTimer(fanSettings);
            
            setNeedUpdate(false);
        }
    }, [needUpdate]);
    
    // draw the cord in normal (pulle=false), or extended (pulled=true) version in the given canvas
    const drawCords = ({canvas, pulled}) => {
        //console.log('id=%s', canvas.id);
        let color = canvas.id === 'speed' ? 'blue' : 'red';
        let bottom_y = pulled ? 120 : 100;
        
        const ctx =canvas.getContext("2d");
        
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.lineWidth = 10
        ctx.strokeStyle = color;
        ctx.moveTo(50, 0);
        ctx.lineTo(50, bottom_y);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle =color;
        ctx.arc(50, bottom_y, 15, 0, 2*Math.PI);
        ctx.fill();
    }
    
    // update fan settings in Mysql db via API
    const updateFanSettings = () => {
        axios.post("/fansettings/", 
            fanSettings)
            .then(res => console.log(res))
            .catch(err => {
                console.log(err);
                alert('Update error');
            });
    }
    
    // start/stop rotation of the fan
    const [rotTimer, setRotTimer] =useState(0);
    const setRotationTimer = (setting) => {
        //console.log('setRotationTimer:');
        
        if(rotTimer) {
            //console.log('clear timer');
            clearInterval(rotTimer);
        }
        
        if(setting.speed > 0) {
            let interval =1000 / setting.speed / setting.speed;
            
            setRotTimer(setInterval( () => {
                let newAngle =((rotation.current + (setting.direction === 0 ? 30 : -30)) % 360);
                // console.log('setRotationTimer: rotation=%s, newAngle=%s, speed=%s, direction=%s',
                //     rotation.current, newAngle, fanSettings.speed, fanSettings.direction);
                rotation.current =newAngle;

                document.getElementById('fan').style.transform = "rotate(" +newAngle +"deg)";
            }, interval));
        } else {
            // rotation stopped
            setRotTimer(0);
        }
    }
    
    // change fan speed
    const handlePullSpeed =() => {
        let newSpeed =fanSettings.speed +1;
        if(newSpeed > 3) newSpeed =0;
        setFanSettings({ ...fanSettings, speed: newSpeed});

        setNeedUpdate(true);
    }
    
    // change fan direction
    const handlePullDirection = () => {
        setFanSettings({ ...fanSettings, direction: 1 - fanSettings.direction});
        
        setNeedUpdate(true);
    }

    // handle the pulling actions on the cord by user
    const handleCordMouseEvent = (e) => {
        //console.log('%s %s %s', e.type, e.target.id, e.clientY);
        let targetActions;
        
        switch(e.target.id) {
            case 'speed':
                targetActions =mySpeedMouseActions.current;
                break;
            case 'direction':
                targetActions =myDirectionMouseActions.current;
                break;
            default:
                return;
        }
        
        switch(e.type) {
            case 'mousedown':
                targetActions.mousedown =true;
                targetActions.initial_y =e.clientY;
                break;
            case 'mousemove':
                if(targetActions.mousedown && e.clientY > targetActions.initial_y) {
                    
                    if(!targetActions.mousedragged) {
                        targetActions.mousedragged = true;
                        
                        // extend the cord
                        drawCords({
                            canvas: e.target.id === 'speed' ? myCanvasSpeed.current : myCanvasDirection.current,
                            pulled: true,
                        })
                    }
                }
                break;
            case 'mouseup':
                if(targetActions.mousedragged) {
                    // reset states
                    targetActions.mousedown = targetActions.mousedragged =false;
                    targetActions.initial_y =-1;
                    
                    if(e.target.id === 'speed') {
                        handlePullSpeed();
                    } else {
                        handlePullDirection();
                    }

                    // restore the cord
                    drawCords({
                        canvas: e.target.id === 'speed' ? myCanvasSpeed.current : myCanvasDirection.current,
                        pulled: false,
                    } )

                }
                break;
            case 'mouseleave':
                // reset states
                targetActions.mousedown = targetActions.mousedragged =false;
                targetActions.initial_y =-1;
                
                // restore the cord
                drawCords({
                    canvas: e.target.id === 'speed' ? myCanvasSpeed.current : myCanvasDirection.current,
                    pulled: false,
                } )
                break;
        }
    }

    return (
        <>
            <div>Fan Speed = {fanSettings.speed}</div>
            <div>Fan Direction = { fanSettings.direction === 0 ? 'Normal' : 'Reversed' }</div>
            <br /><br /><br /><br />
            <div>
                <img id='fan'
                     src={imgFanUrl}
                     width={200} height={200}
                />
            </div>
            <br /><br />
            <div>
                <canvas id='speed' ref={myCanvasSpeed} width={100} height={140}
                        onMouseDown={handleCordMouseEvent}
                        onMouseUp={handleCordMouseEvent}
                        onMouseMove={handleCordMouseEvent}
                        onMouseLeave={handleCordMouseEvent}
                />
                <canvas id='direction' ref={myCanvasDirection} width={100} height={140}
                        onMouseDown={handleCordMouseEvent}
                        onMouseUp={handleCordMouseEvent}
                        onMouseMove={handleCordMouseEvent}
                        onMouseLeave={handleCordMouseEvent}
                />
            </div>
            <div>
                Pull the blue cord to change speed.<br/>
                Pull the red cord to change direction.<br/>
            </div>
        </>
    )
}
ReactDOM.render(<App />, document.getElementById('root'))
