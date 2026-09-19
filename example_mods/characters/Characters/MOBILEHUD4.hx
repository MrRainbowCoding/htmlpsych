//asbelinsabedondevives

//NOT GLOBAL MEANS ONLY SONGS

import Main;
import Type;

import debug.FPSCounter;

import flixel.text.FlxText;
import flixel.util.FlxStringUtil as FlxString;

import openfl.Lib;
import openfl.events.Event;
import openfl.display.Sprite;
import openfl.text.TextField;
import openfl.text.TextFormat;
import openfl.system.System;
import openfl.events.EventDispatcher;
import openfl.display.DisplayObjectContainer;

var memoryText:FlxText; //why this exist here
var curMemory:TextField;
var curMemoryPeak:TextField;

var ch:Sprite;
var curFPS:TextField;
var FPS:TextField;
var extraINF:TextField;

var memory = 0;
var memoryMigas = 0;
var memoryPeak = 0;

var showMore:Bool = true; //Change if you don't want extra info on the screen
var showClass:Bool = false; //If you only want to show the Psych Engine name

var _x:Float = FlxG.onMobile ? 10 : 10; //Having a problem? just put 10 in it or adjust it

function onCreatePost()
{
	memory = 0;
	memoryMigas = 0;
	memoryPeak = 0;
	
	ch = new Sprite();
	var s = new DisplayObjectContainer();
	var dispatch = new EventDispatcher();
	Main.fpsVar.visible = false;
	
	ch.removeEventListener("enterFrame", ___enterFrame);
	
	memoryText = new FlxText(0, 0, 1000, "", 12);
	memoryText.autoSize = false;
	memoryText.text = 'Memory: ';
	memoryText.font = "_sans";
	
	curMemory = new TextField();
	curMemoryPeak = new TextField();
	curFPS = new TextField();
	FPS = new TextField();
	extraINF = new TextField();
	
	for(t in [curMemory, curMemoryPeak])
	{
		t.x = _x;
		t.autoSize = 1;
		t.y = 6;
		t.wordWrap = false;
		t.multiline = false;
		t.defaultTextFormat = new TextFormat("_sans", 12, 0xFFFFFFFF);
	}
	curMemoryPeak.alpha = 0.5;
	
	for(_ in [curFPS, FPS])
	{
		_.x = _x;
		_.text = "FPS";
		_.autoSize = 1;
		_.wordWrap = false;
		_.multiline = false;
		
	}
	FPS.defaultTextFormat = new TextFormat("_sans", 12, 0xFFFFFFFF);
	curFPS.defaultTextFormat = new TextFormat("_sans", 18, 0xFFFFFFFF);
	
	extraINF.x = _x;
	extraINF.autoSize = 1;
	extraINF.wordWrap = false;
	extraINF.multiline = false;
	extraINF.defaultTextFormat = new TextFormat("_sans", 12, 0xFFFFFFFF);
	for(child in [curFPS, FPS, extraINF, curMemory, curMemoryPeak])
		child.alpha *= 0.8;
		
	if(showMore) 
	{
		ch.addChild(extraINF);
	}
	for(child in [curFPS, FPS, curMemory, curMemoryPeak])
		ch.addChild(child);
	Lib.current.addChild(ch);
	
	ch.addEventListener("enterFrame", ___enterFrame);
}

function ___enterFrame()
{
	memoryMigas = System.totalMemory;
	if (memoryPeak < memoryMigas) memoryPeak = FlxString.formatBytes(memoryMigas);
	memory = FlxString.formatBytes(memoryMigas);
	
	curMemory.text = memory;
	curMemoryPeak.text = " /  " + memoryPeak;
	curMemoryPeak.x = curMemory.x + curMemory.width;
	
	curFPS.text = Main.fpsVar.currentFPS;
	FPS.x = curFPS.x + curFPS.width;
	FPS.y = (curFPS.y + curFPS.height) - FPS.height - 1.25;
	
	curMemory.y = curFPS.height - 3;
	curMemoryPeak.y = curMemory.y;
	curFPS.textColor = 0xFFFFFFFF;
	if (Main.fpsVar.currentFPS < FlxG.drawFramerate * 0.5)
		curFPS.textColor = 0xFFFF0000;
	
	if(!showMore) return;
	
	extraINF.text = showClass ? "Vs Evil Fucked Up Bocchi\nPort By LiterallyAsbelin" + Std.string(Type.getClassName(Type.getClass(FlxG.state))) : "FNF: Psych Engine (Psych Port)\nPort by LiterallyAsbelin";
	extraINF.y = curMemory.height + 21.5;
}

//bitch tried to make it work outside but it just duplicates it 

function onDestroy()
{
	for(child in [curFPS, FPS, curMemory, curMemoryPeak, extraINF])
		ch.removeChild(child);
	Main.fpsVar.visible = true;

	FlxG.game.filters = null;
	if (Lib.current.contains(ch)) {
		Lib.current.removeChild(ch);
   }
   
	//DO NOT REMOVE THIS! 
	ch.removeEventListener("enterFrame", ___enterFrame);
}