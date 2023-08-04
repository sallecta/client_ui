"use strict";
const client_ui = {};
client_ui.name = 'client_ui';
client_ui.modules_id = ['core','gallery'];
client_ui.mdls = {};
client_ui.load_err = false;
client_ui.events = {};

client_ui.includer = function()
{
	const me = 'client_ui.includer';
	var cnt = 0;
	function add_script(a_id, a_fn)
	{
		const me = 'client_ui.includer.add_script';
		const el = document.createElement('script');
		el.id = a_id;
		el.src = 'client_ui/modules/'+a_id+'/'+a_id+'.js'; 
		el.type = 'text/javascript';
		el.async = true;
		el.addEventListener('error',a_fn);
		el.addEventListener('load',a_fn);
		document.head.appendChild(el);
	}
	
	// Create the event.
	client_ui.events.ready = document.createEvent("Event");
	client_ui.events.ready.name = 'client_ui.ready';
	client_ui.events.ready.initEvent(client_ui.events.ready.name, true, true);
	
	
	//console.log( me,cnt,' loading module',client_ui.modules_id[cnt] );
	add_script(client_ui.modules_id[cnt],next);
	
	function next(a_ev)
	{
		cnt = cnt + 1;
		if ( a_ev.type === 'load')
		{
			//console.log(me,cnt,' module',a_ev.target.id,'loaded');
			if ( client_ui.modules_id[cnt] )
			{
				//console.log( me,cnt,' loading module',client_ui.modules_id[cnt] );
				add_script(client_ui.modules_id[cnt],next);
			}
			else
			{
				//console.log(me,cnt,'client_ui is ready');
				document.addEventListener( client_ui.events.ready.name, client_ui.exec,false );
				document.dispatchEvent(client_ui.events.ready);
			}
		}
		else if ( a_ev.type === 'error' )
		{
			client_ui.load_err = true;
			console.error(me,cnt,' module',a_ev.target.id,'not loaded');
		}
		else
		{
			client_ui.load_err = true;
			console.error(me,cnt,'unknown result on module',a_ev.id,a_ev.type);
		}
		
	};
}();

client_ui.exec = function(a_ev)
{
	const me = 'client_ui.exec';
	if (typeof client_ui.run === "function")
	{
		console.log(me, 'executing external function client_ui.run');
		client_ui.run();
	}
	else
	{
		console.log(me, 'executing internal demo');
		client_ui.mdls.gallery.create({selector:'.gallery1', nfo:{cfg:'file'}, title:{cfg:'auto'}});
		client_ui.mdls.gallery.create();
	}
}
