//Based on
//drag and drop in vanilla js
//https://codepen.io/lnjpicard/pen/VdeeXr
//by
//Hélène 
//https://codepen.io/lnjpicard

"use strict";
new function()
{
	const mdl={};
	mdl.key='sortman';
	mdl.name=client_ui.name+'.'+mdl.key;
	mdl.defs={};
	mdl.defs.cl_src='src';
	mdl.defs.cl_dest='dest';
	mdl.defs.cl_point='pointer';
	mdl.defs.backw = -1;
	mdl.defs.forw = 1;
	//
	Object.freeze(mdl.defs);
	//
	mdl.inst = [];
	mdl.script_path = window.document.currentScript.src;
	mdl.dirname = function( a_path,a_levels=1 )
	{
		const me=mdl.name+'.dirname';
		let path_len = a_path.length;
		let out;
		let level=1;
		for (let ndx = path_len-1; ndx > -1; ndx--)
		{
			if ( a_path.charAt(ndx-1) === '/')
			{
				if ( level === a_levels )
				{
					//console.log('level === a_levels',level,a_levels);
					out = a_path.slice(0,ndx-1);
					break;
				}
				//console.log('level != a_levels',level,a_levels);
				level = level + 1;
			}
		}
		return out;
	} // mdl.dirname
	mdl.get_valid_el=function( a_el )
	{
		const me = mdl.name+'.get_valid_el';
		if ( !a_el)
		{
			//console.warn(me, 'failed with a_el',a_el);
			return false;
		}
		if ( a_el.ac )
		{
			//console.log(me, 'found valid el',a_el.ac);
			return a_el;
		}
		let parent;
		let child = a_el;
		for(let ndx=0; ndx < 100; ndx++)
		{
			parent = child.parentElement;
			if ( !parent )
			{
				//console.warn(me, 'failed with child',child);
				return false; 
			}
			if ( !parent.ac )
			{
				child = parent;
				continue;
			}
			else
			{
				//console.log(me, 'found valid el',parent);
				return parent;
			}
		}
		//console.warn(me, 'failed with parent',parent);
		return false;
	}
	mdl.dest_els_reindex = function( a_inst )
	{
		a_inst.dest_els = document.querySelectorAll(a_inst.selector);
		for(let ndx=0; ndx < a_inst.dest_els.length; ndx++)
		{
			a_inst.dest_els[ndx].ac.ndx = ndx;
		}
		//noconsole.log(mdl.name+'.dest_els reinedxed',a_inst.dest_els)
	}
	mdl.ins_after = function( a_ref, a_el, a_inst )
	{
		if ( !a_ref.parentNode )
		{
			//noconsole.warn('no parent');
			return false;
		}
		//noconsole.log('inserting',a_el,'after',a_ref);
		const out = a_ref.parentNode.insertBefore(a_el, a_ref.nextSibling);
		if ( out.ac ) { mdl.dest_els_reindex( a_inst );return true;}
		else { return false; }
	}
	mdl.ins_before = function( a_ref, a_el, a_inst )
	{
		if ( !a_ref.parentNode )
		{
			//noconsole.warn('no parent');
			return false;
		}
		//noconsole.log('inserting',a_el,'before',a_ref);
		const out = a_ref.parentNode.insertBefore(a_el, a_ref);
		if ( out.ac ) { mdl.dest_els_reindex( a_inst );return true;}
		else { return false; }
	}
	mdl.ev={};
	mdl.ev.src_d= function( a_ev )
	{// fires a lot of times, do as minimal as possible
		//noconsole.log('src_d','a_ev.target',a_ev.target);
		this.inst.el_src.classList.remove(mdl.defs.cl_src);
	};
	mdl.ev.src_d_start= function( a_ev )
	{
		const me = mdl.name+'.ev.src_d_start';
		const el = mdl.get_valid_el( a_ev.target );
		if ( !el )
		{
			console.warn(me,'failed to get dest el',el);
			return false;
		}
		this.inst.el_src = el;
		//console.log(me,'got el_src',this.inst.el_src);
		this.inst.el_src.classList.add(mdl.defs.cl_src);
	};
	mdl.ev.src_d_end = function( a_ev )
	{
		const me = mdl.name+'.ev.src_d_end';
		const el = mdl.get_valid_el( a_ev.target );
		if ( !el )
		{
			console.warn(me,'failed to get dest el',el);
			return false;
		}
		el.classList.remove(mdl.defs.cl_dest);
		el.classList.remove(mdl.defs.cl_src);
		//console.log(me);
	};
	mdl.ev.dest_d_enter = function( a_ev )
	{
		a_ev.preventDefault();
		const me = mdl.name+'.ev.dest_d_enter';
		const el = mdl.get_valid_el( a_ev.target );
		if ( !el )
		{
			//console.warn(me,'failed to get dest el',el);
			return false;
		}
		if ( !this.inst.el_dest )
		{
			this.inst.el_dest=el;
		}
		
		if ( this.inst.el_dest !== el )
		{
			//console.log(me,'updating el_dest to',el);
			this.inst.el_dest.classList.remove(mdl.defs.cl_dest);
			this.inst.el_dest.classList.remove(mdl.defs.cl_src);
			this.inst.el_dest=el;
		}
		
		el.classList.add(mdl.defs.cl_dest);
		if ( el.ac.ndx < this.inst.el_src.ac.ndx )
		{
			this.inst.direction = mdl.defs.backw; 
		}
		else if ( el.ac.ndx > this.inst.el_src.ac.ndx )
		{
			this.inst.direction = mdl.defs.forw;
		}
		//noconsole.log(me,'entered to',el, 'el_src is',this.inst.el_src, 'direction',this.inst.direction);
	};
	mdl.ev.dest_d_over = function( a_ev ) 
	{// fires a lot of times, do as minimal as possible
		//noconsole.log('dest_d_over');  
		a_ev.preventDefault();// to allow drop
	};
	mdl.ev.dest_d_leave=function( a_ev )
	{
		/* fires after drag enter ev, useless. */
		//const me = mdl.name+'.ev.dest_d_leave';
		//const el = mdl.get_valid_el( a_ev.target );
		//if ( !el )
		//{
			//console.warn(me,'failed to get dest el',el);
			//return false;
		//}
		////console.log(me,'el',el);
		//el.classList.remove(mdl.defs.cl_dest);
		//el.classList.remove(mdl.defs.cl_src);
	};
	mdl.ev.dest_d_drop = function( a_ev )
	{
		const me = mdl.name+'.ev.dest_d_drop';
		const el = mdl.get_valid_el( a_ev.target );
		if ( !el )
		{
			console.warn(me,'failed to get dest el',el);
			return false;
		}
		a_ev.preventDefault();
		el.classList.remove(mdl.defs.cl_dest);
		el.classList.remove(mdl.defs.cl_src);
		if ( el == this.inst.el_src )
		{
			//noconsole.warn('same els',el); 
			return; 
		}
		//this.inst.el_src.parentNode.removeChild(this.inst.el_src);
		if ( this.inst.direction==mdl.defs.forw )
		{ mdl.ins_after(el, this.inst.el_src, this.inst); }
		else if ( this.inst.direction==mdl.defs.backw )
		{ mdl.ins_before(el, this.inst.el_src, this.inst); }
	};
	
	mdl.configure = function ()
	{
		const me = mdl.name+'.configure';
		mdl.path = mdl.dirname(mdl.script_path);
		mdl.path = client_ui.mdls.core.dirname(mdl.script_path);
		//console.log(me,mdl.name+'.path',mdl.path);
		const el_css = document.createElement('link');
		el_css.rel = 'stylesheet'; 
		el_css.href = mdl.path+'/css/'+mdl.name+'.css'; 
		el_css.type = 'text/css';
		document.head.appendChild(el_css);
		mdl.configured=true;
	}
	
	mdl.run = function ( a_selector )
	{
		const me = mdl.name+'.run';
		if ( !mdl.configured )
		{
			mdl.configure();
		}
		
		const dest_els = document.querySelectorAll(a_selector);
		
		//console.log(me,'dest_els',dest_els);
		
		if ( !dest_els || dest_els.length<1 )
		{	
			console.warn(me,'no dest_els',dest_els);
			return null;
		}
		
		const new_inst = {};
		new_inst.selector = a_selector;
		new_inst.dest_els = dest_els;
		
		new_inst.display=getComputedStyle(dest_els[0]).getPropertyValue('display');
		
		mdl.inst.push( new_inst );
		
		const to_fn = {inst:new_inst};
		
		for(let ndx=0; ndx < dest_els.length; ndx++)
		{
			const dest_el = dest_els[ndx];
			dest_el.ac={};
			dest_el.ac.ndx = ndx;
			
			dest_el.addEventListener('dragstart', mdl.ev.src_d_start.bind(to_fn));
			dest_el.addEventListener('drag', mdl.ev.src_d.bind(to_fn));
			dest_el.addEventListener('dragend', mdl.ev.src_d_end.bind(to_fn));
			dest_el.setAttribute('draggable', true);
			
			dest_el.addEventListener('dragenter', mdl.ev.dest_d_enter.bind(to_fn));
			dest_el.addEventListener('dragover', mdl.ev.dest_d_over.bind(to_fn));
			dest_el.addEventListener('dragleave', mdl.ev.dest_d_leave.bind(to_fn));
			dest_el.addEventListener('drop', mdl.ev.dest_d_drop.bind(to_fn));
			
			dest_el.classList.add(mdl.defs.cl_point);
		}
		
		dest_els[0].parentElement.style.setProperty('--disp', new_inst.display);
		dest_els[0].parentElement.classList.add('sortman');
		//console.log('display',new_inst.display);
	} // mdl.run

	/**/
	function add_module()
	{
		const me = mdl.name+'.add_module';
		client_ui.mdls[mdl.key] = mdl;
		//console.log(me,'done');
	}
	document.addEventListener( client_ui.events.ready.name, add_module,false );
	/**/
} // new function

