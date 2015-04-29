/*! FileAPI 2.0.7 - BSD | git://github.com/mailru/FileAPI.git
 * FileAPI — a set of  javascript tools for working with files. Multiupload, drag'n'drop and chunked file upload. Images: crop, resize and auto orientation by EXIF.
 */

/*
 * JavaScript Canvas to Blob 2.0.5
 * https://github.com/blueimp/JavaScript-Canvas-to-Blob
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on stackoverflow user Stoive's code snippet:
 * http://stackoverflow.com/q/4998908
 */

/*jslint nomen: true, regexp: true */
/*global window, atob, Blob, ArrayBuffer, Uint8Array */

(function (window) {
    'use strict';
    var CanvasPrototype = window.HTMLCanvasElement &&
            window.HTMLCanvasElement.prototype,
        hasBlobConstructor = window.Blob && (function () {
            try {
                return Boolean(new Blob());
            } catch (e) {
                return false;
            }
        }()),
        hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array &&
            (function () {
                try {
                    return new Blob([new Uint8Array(100)]).size === 100;
                } catch (e) {
                    return false;
                }
            }()),
        BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
            window.MozBlobBuilder || window.MSBlobBuilder,
        dataURLtoBlob = (hasBlobConstructor || BlobBuilder) && window.atob &&
            window.ArrayBuffer && window.Uint8Array && function (dataURI) {
                var byteString,
                    arrayBuffer,
                    intArray,
                    i,
                    mimeString,
                    bb;
                if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                    byteString = atob(dataURI.split(',')[1]);
                } else {
                    byteString = decodeURIComponent(dataURI.split(',')[1]);
                }
                arrayBuffer = new ArrayBuffer(byteString.length);
                intArray = new Uint8Array(arrayBuffer);
                for (i = 0; i < byteString.length; i += 1) {
                    intArray[i] = byteString.charCodeAt(i);
                }
                mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                if (hasBlobConstructor) {
                    return new Blob(
                        [hasArrayBufferViewSupport ? intArray : arrayBuffer],
                        {type: mimeString}
                    );
                }
                bb = new BlobBuilder();
                bb.append(arrayBuffer);
                return bb.getBlob(mimeString);
            };
    if (window.HTMLCanvasElement && !CanvasPrototype.toBlob) {
        if (CanvasPrototype.mozGetAsFile) {
            CanvasPrototype.toBlob = function (callback, type, quality) {
                if (quality && CanvasPrototype.toDataURL && dataURLtoBlob) {
                    callback(dataURLtoBlob(this.toDataURL(type, quality)));
                } else {
                    callback(this.mozGetAsFile('blob', type));
                }
            };
        } else if (CanvasPrototype.toDataURL && dataURLtoBlob) {
            CanvasPrototype.toBlob = function (callback, type, quality) {
                callback(dataURLtoBlob(this.toDataURL(type, quality)));
            };
        }
    }
    window.dataURLtoBlob = dataURLtoBlob;
})(window);

/*jslint evil: true */
/*global window, URL, webkitURL, ActiveXObject */

(function (window, undef){
	'use strict';

	var
		gid = 1,
		noop = function (){},

		document = window.document,
		doctype = document.doctype || {},
		userAgent = window.navigator.userAgent,
		apiURL = (window.createObjectURL && window) || (window.URL && URL.revokeObjectURL && URL) || (window.webkitURL && webkitURL),

		Blob = window.Blob,
		File = window.File,
		FileReader = window.FileReader,
		FormData = window.FormData,


		XMLHttpRequest = window.XMLHttpRequest,
		jQuery = window.jQuery,

		html5 =    !!(File && (FileReader && (window.Uint8Array || FormData || XMLHttpRequest.prototype.sendAsBinary)))
				&& !(/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent) && /windows/i.test(userAgent)), // BugFix: https://github.com/mailru/FileAPI/issues/25

		cors = html5 && ('withCredentials' in (new XMLHttpRequest)),

		chunked = html5 && !!Blob && !!(Blob.prototype.webkitSlice || Blob.prototype.mozSlice || Blob.prototype.slice),
		dataURLtoBlob = window.dataURLtoBlob,


		_rimg = /img/i,
		_rcanvas = /canvas/i,
		_rimgcanvas = /img|canvas/i,
		_rinput = /input/i,
		_rdata = /^data:[^,]+,/,

		_toString = {}.toString,


		Math = window.Math,

		_SIZE_CONST = function (pow){
			pow = new window.Number(Math.pow(1024, pow));
			pow.from = function (sz){ return Math.round(sz * this); };
			return	pow;
		},

		_elEvents = {}, // element event listeners
		_infoReader = [], // list of file info processors

		_readerEvents = 'abort progress error load loadend',
		_xhrPropsExport = 'status statusText readyState response responseXML responseText responseBody'.split(' '),

		currentTarget = 'currentTarget', // for minimize
		preventDefault = 'preventDefault', // and this too

		_isArray = function (ar) {
			return	ar && ('length' in ar);
		},

				_each = function (obj, fn, ctx){
			if( obj ){
				if( _isArray(obj) ){
					for( var i = 0, n = obj.length; i < n; i++ ){
						if( i in obj ){
							fn.call(ctx, obj[i], i, obj);
						}
					}
				}
				else {
					for( var key in obj ){
						if( obj.hasOwnProperty(key) ){
							fn.call(ctx, obj[key], key, obj);
						}
					}
				}
			}
		},

				_extend = function (dst){
			var args = arguments, i = 1, _ext = function (val, key){ dst[key] = val; };
			for( ; i < args.length; i++ ){
				_each(args[i], _ext);
			}
			return  dst;
		},

				_on = function (el, type, fn){
			if( el ){
				var uid = api.uid(el);

				if( !_elEvents[uid] ){
					_elEvents[uid] = {};
				}

				var isFileReader = (FileReader && el) && (el instanceof FileReader);
				_each(type.split(/\s+/), function (type){
					if( jQuery && !isFileReader){
						jQuery.event.add(el, type, fn);
					} else {
						if( !_elEvents[uid][type] ){
							_elEvents[uid][type] = [];
						}

						_elEvents[uid][type].push(fn);

						if( el.addEventListener ){ el.addEventListener(type, fn, false); }
						else if( el.attachEvent ){ el.attachEvent('on'+type, fn); }
						else { el['on'+type] = fn; }
					}
				});
			}
		},


				_off = function (el, type, fn){
			if( el ){
				var uid = api.uid(el), events = _elEvents[uid] || {};

				var isFileReader = (FileReader && el) && (el instanceof FileReader);
				_each(type.split(/\s+/), function (type){
					if( jQuery && !isFileReader){
						jQuery.event.remove(el, type, fn);
					}
					else {
						var fns = events[type] || [], i = fns.length;

						while( i-- ){
							if( fns[i] === fn ){
								fns.splice(i, 1);
								break;
							}
						}

						if( el.addEventListener ){ el.removeEventListener(type, fn, false); }
						else if( el.detachEvent ){ el.detachEvent('on'+type, fn); }
						else { el['on'+type] = null; }
					}
				});
			}
		},


		_one = function(el, type, fn){
			_on(el, type, function _(evt){
				_off(el, type, _);
				fn(evt);
			});
		},


		_fixEvent = function (evt){
			if( !evt.target ){ evt.target = window.event && window.event.srcElement || document; }
			if( evt.target.nodeType === 3 ){ evt.target = evt.target.parentNode; }
			return  evt;
		},


		_supportInputAttr = function (attr){
			var input = document.createElement('input');
			input.setAttribute('type', "file");
			return attr in input;
		},


				api = {
			version: '2.0.7',

			cors: false,
			html5: true,
			media: false,
			formData: true,
			multiPassResize: true,

			debug: false,
			pingUrl: false,
			multiFlash: false,
			flashAbortTimeout: 0,
			withCredentials: true,

			staticPath: './dist/',

			flashUrl: 0, // @default: './FileAPI.flash.swf'
			flashImageUrl: 0, // @default: './FileAPI.flash.image.swf'

			postNameConcat: function (name, idx){
				return	name + (idx != null ? '['+ idx +']' : '');
			},

			ext2mime: {
				  jpg:	'image/jpeg'
				, tif:	'image/tiff'
				, txt:	'text/plain'
			},
			accept: {
				  'image/*': 'art bm bmp dwg dxf cbr cbz fif fpx gif ico iefs jfif jpe jpeg jpg jps jut mcf nap nif pbm pcx pgm pict pm png pnm qif qtif ras rast rf rp svf tga tif tiff xbm xbm xpm xwd'
				, 'audio/*': 'm4a flac aac rm mpa wav wma ogg mp3 mp2 m3u mod amf dmf dsm far gdm imf it m15 med okt s3m stm sfx ult uni xm sid ac3 dts cue aif aiff wpl ape mac mpc mpp shn wv nsf spc gym adplug adx dsp adp ymf ast afc hps xs'
				, 'video/*': 'm4v 3gp nsv ts ty strm rm rmvb m3u ifo mov qt divx xvid bivx vob nrg img iso pva wmv asf asx ogm m2v avi bin dat dvr-ms mpg mpeg mp4 mkv avc vp3 svq3 nuv viv dv fli flv wpl'
			},

			uploadRetry : 0,
			networkDownRetryTimeout : 5000, // milliseconds, don't flood when network is down

			chunkSize : 0,
			chunkUploadRetry : 0,
			chunkNetworkDownRetryTimeout : 2000, // milliseconds, don't flood when network is down

			KB: _SIZE_CONST(1),
			MB: _SIZE_CONST(2),
			GB: _SIZE_CONST(3),
			TB: _SIZE_CONST(4),

			EMPTY_PNG: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',

			expando: 'fileapi' + (new Date).getTime(),

			uid: function (obj){
				return	obj
					? (obj[api.expando] = obj[api.expando] || api.uid())
					: (++gid, api.expando + gid)
				;
			},

			log: function (){
				if( api.debug && window.console && console.log ){
					if( console.log.apply ){
						console.log.apply(console, arguments);
					}
					else {
						console.log([].join.call(arguments, ' '));
					}
				}
			},

						newImage: function (src, fn){
				var img = document.createElement('img');
				if( fn ){
					api.event.one(img, 'error load', function (evt){
						fn(evt.type == 'error', img);
						img = null;
					});
				}
				img.src = src;
				return	img;
			},

						getXHR: function (){
				var xhr;

				if( XMLHttpRequest ){
					xhr = new XMLHttpRequest;
				}
				else if( window.ActiveXObject ){
					try {
						xhr = new ActiveXObject('MSXML2.XMLHttp.3.0');
					} catch (e) {
						xhr = new ActiveXObject('Microsoft.XMLHTTP');
					}
				}

				return  xhr;
			},

			isArray: _isArray,

			support: {
				dnd:     cors && ('ondrop' in document.createElement('div')),
				cors:    cors,
				html5:   html5,
				chunked: chunked,
				dataURI: true,
				accept:   _supportInputAttr('accept'),
				multiple: _supportInputAttr('multiple')
			},

			event: {
				  on: _on
				, off: _off
				, one: _one
				, fix: _fixEvent
			},


			throttle: function(fn, delay) {
				var id, args;

				return function _throttle(){
					args = arguments;

					if( !id ){
						fn.apply(window, args);
						id = setTimeout(function (){
							id = 0;
							fn.apply(window, args);
						}, delay);
					}
				};
			},


			F: function (){},


			parseJSON: function (str){
				var json;
				if( window.JSON && JSON.parse ){
					json = JSON.parse(str);
				}
				else {
					json = (new Function('return ('+str.replace(/([\r\n])/g, '\\$1')+');'))();
				}
				return json;
			},


			trim: function (str){
				str = String(str);
				return	str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
			},

						defer: function (){
				var
					  list = []
					, result
					, error
					, defer = {
						resolve: function (err, res){
							defer.resolve = noop;
							error	= err || false;
							result	= res;

							while( res = list.shift() ){
								res(error, result);
							}
						},

						then: function (fn){
							if( error !== undef ){
								fn(error, result);
							} else {
								list.push(fn);
							}
						}
				};

				return	defer;
			},

			queue: function (fn){
				var
					  _idx = 0
					, _length = 0
					, _fail = false
					, _end = false
					, queue = {
						inc: function (){
							_length++;
						},

						next: function (){
							_idx++;
							setTimeout(queue.check, 0);
						},

						check: function (){
							(_idx >= _length) && !_fail && queue.end();
						},

						isFail: function (){
							return _fail;
						},

						fail: function (){
							!_fail && fn(_fail = true);
						},

						end: function (){
							if( !_end ){
								_end = true;
								fn();
							}
						}
					}
				;
				return queue;
			},


						each: _each,


						afor: function (array, callback){
				var i = 0, n = array.length;

				if( _isArray(array) && n-- ){
					(function _next(){
						callback(n != i && _next, array[i], i++);
					})();
				}
				else {
					callback(false);
				}
			},


						extend: _extend,


						isFile: function (file){
				return _toString.call(file) === '[object File]';
			},


						isBlob: function (blob) {
				return this.isFile(blob) || (_toString.call(blob) === '[object Blob]');
			},


						isCanvas: function (el){
				return	el && _rcanvas.test(el.nodeName);
			},


			getFilesFilter: function (filter){
				filter = typeof filter == 'string' ? filter : (filter.getAttribute && filter.getAttribute('accept') || '');
				return	filter ? new RegExp('('+ filter.replace(/\./g, '\\.').replace(/,/g, '|') +')$', 'i') : /./;
			},



						readAsDataURL: function (file, fn){
				if( api.isCanvas(file) ){
					_emit(file, fn, 'load', api.toDataURL(file));
				}
				else {
					_readAs(file, fn, 'DataURL');
				}
			},


						readAsBinaryString: function (file, fn){
				if( _hasSupportReadAs('BinaryString') ){
					_readAs(file, fn, 'BinaryString');
				} else {
					_readAs(file, function (evt){
						if( evt.type == 'load' ){
							try {
								evt.result = api.toBinaryString(evt.result);
							} catch (e){
								evt.type = 'error';
								evt.message = e.toString();
							}
						}
						fn(evt);
					}, 'DataURL');
				}
			},


						readAsArrayBuffer: function(file, fn){
				_readAs(file, fn, 'ArrayBuffer');
			},


						readAsText: function(file, encoding, fn){
				if( !fn ){
					fn	= encoding;
					encoding = 'utf-8';
				}

				_readAs(file, fn, 'Text', encoding);
			},


						toDataURL: function (el, type){
				if( typeof el == 'string' ){
					return  el;
				}
				else if( el.toDataURL ){
					return  el.toDataURL(type || 'image/png');
				}
			},


						toBinaryString: function (val){
				return  window.atob(api.toDataURL(val).replace(_rdata, ''));
			},


						readAsImage: function (file, fn, progress){
				if( api.isFile(file) ){
					if( apiURL ){
												var data = apiURL.createObjectURL(file);
						if( data === undef ){
							_emit(file, fn, 'error');
						}
						else {
							api.readAsImage(data, fn, progress);
						}
					}
					else {
						api.readAsDataURL(file, function (evt){
							if( evt.type == 'load' ){
								api.readAsImage(evt.result, fn, progress);
							}
							else if( progress || evt.type == 'error' ){
								_emit(file, fn, evt, null, { loaded: evt.loaded, total: evt.total });
							}
						});
					}
				}
				else if( api.isCanvas(file) ){
					_emit(file, fn, 'load', file);
				}
				else if( _rimg.test(file.nodeName) ){
					if( file.complete ){
						_emit(file, fn, 'load', file);
					}
					else {
						var events = 'error abort load';
						_one(file, events, function _fn(evt){
							if( evt.type == 'load' && apiURL ){
																apiURL.revokeObjectURL(file.src);
							}

							_off(file, events, _fn);
							_emit(file, fn, evt, file);
						});
					}
				}
				else if( file.iframe ){
					_emit(file, fn, { type: 'error' });
				}
				else {
					var img = api.newImage(file.dataURL || file);
					api.readAsImage(img, fn, progress);
				}
			},


						checkFileObj: function (name){
				var file = {}, accept = api.accept;

				if( typeof name == 'object' ){
					file = name;
				}
				else {
					file.name = (name + '').split(/\\|\//g).pop();
				}

				if( file.type == null ){
					file.type = file.name.split('.').pop();
				}

				_each(accept, function (ext, type){
					ext = new RegExp(ext.replace(/\s/g, '|'), 'i');
					if( ext.test(file.type) || api.ext2mime[file.type] ){
						file.type = api.ext2mime[file.type] || (type.split('/')[0] +'/'+ file.type);
					}
				});

				return	file;
			},


						getDropFiles: function (evt, callback){
				var
					  files = []
					, dataTransfer = _getDataTransfer(evt)
					, entrySupport = _isArray(dataTransfer.items) && dataTransfer.items[0] && _getAsEntry(dataTransfer.items[0])
					, queue = api.queue(function (){ callback(files); })
				;

				_each((entrySupport ? dataTransfer.items : dataTransfer.files) || [], function (item){
					queue.inc();

					try {
						if( entrySupport ){
							_readEntryAsFiles(item, function (err, entryFiles){
								if( err ){
									api.log('[err] getDropFiles:', err);
								} else {
									files.push.apply(files, entryFiles);
								}
								queue.next();
							});
						}
						else {
							_isRegularFile(item, function (yes){
								yes && files.push(item);
								queue.next();
							});
						}
					}
					catch( err ){
						queue.next();
						api.log('[err] getDropFiles: ', err);
					}
				});

				queue.check();
			},


						getFiles: function (input, filter, callback){
				var files = [];

				if( callback ){
					api.filterFiles(api.getFiles(input), filter, callback);
					return null;
				}

				if( input.jquery ){
					input.each(function (){
						files = files.concat(api.getFiles(this));
					});
					input	= files;
					files	= [];
				}

				if( typeof filter == 'string' ){
					filter	= api.getFilesFilter(filter);
				}

				if( input.originalEvent ){
					input = _fixEvent(input.originalEvent);
				}
				else if( input.srcElement ){
					input = _fixEvent(input);
				}


				if( input.dataTransfer ){
					input = input.dataTransfer;
				}
				else if( input.target ){
					input = input.target;
				}

				if( input.files ){
					files = input.files;

					if( !html5 ){
						files[0].blob	= input;
						files[0].iframe	= true;
					}
				}
				else if( !html5 && isInputFile(input) ){
					if( api.trim(input.value) ){
						files = [api.checkFileObj(input.value)];
						files[0].blob   = input;
						files[0].iframe = true;
					}
				}
				else if( _isArray(input) ){
					files	= input;
				}

				return	api.filter(files, function (file){ return !filter || filter.test(file.name); });
			},


						getTotalSize: function (files){
				var size = 0, i = files && files.length;
				while( i-- ){
					size += files[i].size;
				}
				return	size;
			},


						getInfo: function (file, fn){
				var info = {}, readers = _infoReader.concat();

				if( api.isFile(file) ){
					(function _next(){
						var reader = readers.shift();
						if( reader ){
							if( reader.test(file.type) ){
								reader(file, function (err, res){
									if( err ){
										fn(err);
									}
									else {
										_extend(info, res);
										_next();
									}
								});
							}
							else {
								_next();
							}
						}
						else {
							fn(false, info);
						}
					})();
				}
				else {
					fn('not_support_info', info);
				}
			},


						addInfoReader: function (mime, fn){
				fn.test = function (type){ return mime.test(type); };
				_infoReader.push(fn);
			},


						filter: function (input, fn){
				var result = [], i = 0, n = input.length, val;

				for( ; i < n; i++ ){
					if( i in input ){
						val = input[i];
						if( fn.call(val, val, i, input) ){
							result.push(val);
						}
					}
				}

				return	result;
			},


						filterFiles: function (files, eachFn, resultFn){
				if( files.length ){
					var queue = files.concat(), file, result = [], deleted = [];

					(function _next(){
						if( queue.length ){
							file = queue.shift();
							api.getInfo(file, function (err, info){
								(eachFn(file, err ? false : info) ? result : deleted).push(file);
								_next();
							});
						}
						else {
							resultFn(result, deleted);
						}
					})();
				}
				else {
					resultFn([], files);
				}
			},


			upload: function (options){
				options = _extend({
					  jsonp: 'callback'
					, prepare: api.F
					, beforeupload: api.F
					, upload: api.F
					, fileupload: api.F
					, fileprogress: api.F
					, filecomplete: api.F
					, progress: api.F
					, complete: api.F
					, pause: api.F
					, imageOriginal: true
					, chunkSize: api.chunkSize
					, chunkUploadRetry: api.chunkUploadRetry
					, uploadRetry: api.uploadRetry
				}, options);


				if( options.imageAutoOrientation && !options.imageTransform ){
					options.imageTransform = { rotate: 'auto' };
				}


				var
					  proxyXHR = new api.XHR(options)
					, dataArray = this._getFilesDataArray(options.files)
					, _this = this
					, _total = 0
					, _loaded = 0
					, _nextFile
					, _complete = false
				;
				_each(dataArray, function (data){
					_total += data.size;
				});
				proxyXHR.files = [];
				_each(dataArray, function (data){
					proxyXHR.files.push(data.file);
				});
				proxyXHR.total	= _total;
				proxyXHR.loaded	= 0;
				proxyXHR.filesLeft = dataArray.length;
				options.beforeupload(proxyXHR, options);
				_nextFile = function (){
					var
						  data = dataArray.shift()
						, _file = data && data.file
						, _fileLoaded = false
						, _fileOptions = _simpleClone(options)
					;

					proxyXHR.filesLeft = dataArray.length;

					if( _file && _file.name === api.expando ){
						_file = null;
						api.log('[warn] FileAPI.upload() — called without files');
					}

					if( ( proxyXHR.statusText != 'abort' || proxyXHR.current ) && data ){
						_complete = false;
						proxyXHR.currentFile = _file;
						if (_file && options.prepare(_file, _fileOptions) === false) {
							_nextFile.call(_this);
							return;
						}
						_fileOptions.file = _file;

						_this._getFormData(_fileOptions, data, function (form){
							if( !_loaded ){
								options.upload(proxyXHR, options);
							}

							var xhr = new api.XHR(_extend({}, _fileOptions, {

								upload: _file ? function (){
									options.fileupload(_file, xhr, _fileOptions);
								} : noop,

								progress: _file ? function (evt){
									if( !_fileLoaded ){
										_fileLoaded = (evt.loaded === evt.total);
										options.fileprogress({
											  type:   'progress'
											, total:  data.total = evt.total
											, loaded: data.loaded = evt.loaded
										}, _file, xhr, _fileOptions);
										options.progress({
											  type:   'progress'
											, total:  _total
											, loaded: proxyXHR.loaded = (_loaded + data.size * (evt.loaded/evt.total))|0
										}, _file, xhr, _fileOptions);
									}
								} : noop,

								complete: function (err){
									_each(_xhrPropsExport, function (name){
										proxyXHR[name] = xhr[name];
									});

									if( _file ){
										data.total = (data.total || data.size);
										data.loaded	= data.total;

										if( !err ) {
											this.progress(data);
											_fileLoaded = true;
											_loaded += data.size; // data.size != data.total, it's desirable fix this
											proxyXHR.loaded = _loaded;
										}
										options.filecomplete(err, xhr, _file, _fileOptions);
									}
									setTimeout(function () {_nextFile.call(_this);}, 0);
								}
							})); // xhr
							proxyXHR.abort = function (current){
								if (!current) { dataArray.length = 0; }
								this.current = current;
								xhr.abort();
							};
							xhr.send(form);
						});
					}
					else {
						var successful = proxyXHR.status == 200 || proxyXHR.status == 201 || proxyXHR.status == 204;
						options.complete(successful ? false : (proxyXHR.statusText || 'error'), proxyXHR, options);
						_complete = true;
					}
				};
				setTimeout(_nextFile, 0);
				proxyXHR.append = function (files, first) {
					files = api._getFilesDataArray([].concat(files));

					_each(files, function (data) {
						_total += data.size;
						proxyXHR.files.push(data.file);
						if (first) {
							dataArray.unshift(data);
						} else {
							dataArray.push(data);
						}
					});

					proxyXHR.statusText = "";

					if( _complete ){
						_nextFile.call(_this);
					}
				};
				proxyXHR.remove = function (file) {
				    var i = dataArray.length, _file;
				    while( i-- ){
						if( dataArray[i].file == file ){
							_file = dataArray.splice(i, 1);
							_total -= _file.size;
						}
					}
					return	_file;
				};

				return proxyXHR;
			},


			_getFilesDataArray: function (data){
				var files = [], oFiles = {};

				if( isInputFile(data) ){
					var tmp = api.getFiles(data);
					oFiles[data.name || 'file'] = data.getAttribute('multiple') !== null ? tmp : tmp[0];
				}
				else if( _isArray(data) && isInputFile(data[0]) ){
					_each(data, function (input){
						oFiles[input.name || 'file'] = api.getFiles(input);
					});
				}
				else {
					oFiles = data;
				}

				_each(oFiles, function add(file, name){
					if( _isArray(file) ){
						_each(file, function (file){
							add(file, name);
						});
					}
					else if( file && (file.name || file.image) ){
						files.push({
							  name: name
							, file: file
							, size: file.size
							, total: file.size
							, loaded: 0
						});
					}
				});

				if( !files.length ){
					files.push({ file: { name: api.expando } });
				}

				return	files;
			},


			_getFormData: function (options, data, fn){
				var
					  file = data.file
					, name = data.name
					, filename = file.name
					, filetype = file.type
					, trans = api.support.transform && options.imageTransform
					, Form = new api.Form
					, queue = api.queue(function (){ fn(Form); })
					, isOrignTrans = trans && _isOriginTransform(trans)
					, postNameConcat = api.postNameConcat
				;
				_each(options.data, function add(val, name){
					if( typeof val == 'object' ){
						_each(val, function (v, i){
							add(v, postNameConcat(name, i));
						});
					}
					else {
						Form.append(name, val);
					}
				});

				(function _addFile(file			load: function (url, fn){
				var xhr = api.getXHR();
				if( xhr ){
					xhr.open('GET', url, true);

					if( xhr.overrideMimeType ){
				        xhr.overrideMimeType('text/plain; charset=x-user-defined');
					}

					_on(xhr, 'progress', function (						if( evt.lengthComputable ){
							fn({ type: evt.type, loaded: evt.loaded, total: evt.total }, xhr);
						}
					});

					xhr.onreadystatechange = function(){
						if( xhr.readyState == 4 ){
							xhr.onreadystatechange = null;
							if( xhr.status == 200 ){
								url = url.split('/');
																var file = {
								      name: url[url.length-1]
									, size: xhr.getResponseHeader('Content-Length')
									, type: xhr.getResponseHeader('Content-Type')
								};
								file.dataURL = 'data:'+file.type+';base64,' + api.encode64(xhr.responseBody || xhr.responseText);
								fn({ type: 'load', result: file }, xhr);
							}
							else {
								fn({ type: 'error' }, xhr);
							}
					    }
					};
				    xhr.send(null);
				} else {
					fn({ type: 'error' });
				}

				return  xhr;
			},

			encode64: function (str){
				var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', outStr = '', i = 0;

				if( typeof str !== 'string' ){
					str	= String(str);
				}

				while( i < str.length ){
					var
						  byte1 = str.charCodeAt(i++) & 0xff
						, byte2 = str.charCodeAt(i++) & 0xff
						, byte3 = str.charCodeAt(i++) & 0xff
						, enc1 = byte1 >> 2
						, enc2 = ((byte1 & 3) << 4) | (byte2 >> 4)
						, enc3, enc4
					;

					if( isNaN(byte2) ){
						enc3 = enc4 = 64;
					} else {
						enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
						enc4 = isNaN(byte3) ? 64 : byte3 & 63;
					}

					outStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
				}

				return  outStr;
			}

		} // api
	;


	function _emit(target, fn, name, res, ext){
		var evt = {
			  type:		name.type || name
			, target:	target
			, result:	res
		};
		_extend(evt, ext);
		fn(evt);
	}


	function _hasSupportReadAs(as){
		return	FileReader && !!FileReader.prototype['readAs'+as];
	}


	function _readAs(file, fn, as, encoding){
		if( api.isBlob(file) && _hasSupportReadAs(as) ){
			var Reader = new FileReader;
			_on(Reader, _readerEvents, function _fn(evt){
				var type = evt.type;
				if( type == 'progress' ){
					_emit(file, fn, evt, evt.target.result, { loaded: evt.loaded, total: evt.total });
				}
				else if( type == 'loadend' ){
					_off(Reader, _readerEvents, _fn);
					Reader = null;
				}
				else {
					_emit(file, fn, evt, evt.target.result);
				}
			});


			try {
				if( encoding ){
					Reader['readAs'+as](file, encoding);
				}
				else {
					Reader['readAs'+as](file);
				}
			}
			catch (err){
				_emit(file, fn, 'error', undef, { error: err.toString() });
			}
		}
		else {
			_emit(file, fn, 'error', undef, { error: 'filreader_not_support_'+as });
		}
	}


	function _isRegularFile(file, callback){
		if( !file.type && (file.size % 4096) === 0 && (file.size <= 102400) ){
			if( FileReader ){
				try {
					var Reader = new FileReader();

					_one(Reader, _readerEvents, function (evt){
						var isFile = evt.type != 'error';
						callback(isFile);
						if( isFile ){
							Reader.abort();
						}
					});

					Reader.readAsDataURL(file);
				} catch( err ){
					callback(false);
				}
			}
			else {
				callback(null);
			}
		}
		else {
			callback(true);
		}
	}


	function _getAsEntry(item){
		var entry;
		if( item.getAsEntry ){ entry = item.getAsEntry(); }
		else if( item.webkitGetAsEntry ){ entry = item.webkitGetAsEntry(); }
		return	entry;
	}


	function _readEntryAsFiles(entry, callback){
		if( !entry ){
			callback('invalid entry');
		}
		else if( entry.isFile ){
			entry.file(function(file){
				file.fullPath = entry.fullPath;
				callback(false, [file]);
			}, function (err){
				callback('FileError.code: '+err.code);
			});
		}
		else if( entry.isDirectory ){
			var reader = entry.createReader(), result = [];

			reader.readEntries(function(entries){
				api.afor(entries, function (next, entry){
					_readEntryAsFiles(entry, function (err, files){
						if( err ){
							api.log(err);
						}
						else {
							result = result.concat(files);
						}

						if( next ){
							next();
						}
						else {
							callback(false, result);
						}
					});
				});
			}, function (err){
				callback('directory_reader: ' + err);
			});
		}
		else {
			_readEntryAsFiles(_getAsEntry(entry), callback);
		}
	}


	function _simpleClone(obj){
		var copy = {};
		_each(obj, function (val, key){
			if( val && (typeof val === 'object') && (val.nodeType === void 0) ){
				val = _extend({}, val);
			}
			copy[key] = val;
		});
		return	copy;
	}


	function isInputFile(el){
		return	_rinput.test(el && el.tagName);
	}


	function _getDataTransfer(evt){
		return	(evt.originalEvent || evt || '').dataTransfer || {};
	}


	function _isOriginTransform(trans){
		var key;
		for( key in trans ){
			if( trans.hasOwnProperty(key) ){
				if( !(trans[key] instanceof Object || key === 'overlay' || key === 'filter') ){
					return	true;
				}
			}
		}
		return	false;
	}
	api.addInfoReader(/^image/, function (file	api.event.dnd = function (el, onHover, onDrop){
		var _id, _type;

		if( !onDrop ){
			onDrop = onHover;
			onHover = api.F;
		}

		if( FileReader ){
			_on(el, 'dragenter dragleave dragover', onHover.ff = onHover.ff || function (evt){
				var
					  types = _getDataTransfer(evt).types
					, i = types && types.length
					, debounceTrigger = false
				;

				while( i-- ){
					if( ~types[i].indexOf('File') ){
						evt[preventDefault]();

						if( _type !== evt.type ){
							_type = evt.type; // Store current type of event

							if( _type != 'dragleave' ){
								onHover.call(evt[currentTarget], true, evt);
							}

							debounceTrigger = true;
						}

						break; // exit from "while"
					}
				}

				if( debounceTrigger ){
					clearTimeout(_id);
					_id = setTimeout(function (){
						onHover.call(evt[currentTarget], _type != 'dragleave', evt);
					}, 50);
				}
			});
			_on(el, 'drop', onDrop.ff = onDrop.ff || function (evt){
				evt[preventDefault]();

				_type = 0;
				onHover.call(evt[currentTarget], false, evt);

				api.getDropFiles(evt, function (files){
					onDrop.call(evt[currentTarget], files, evt);
				});
			});
		}
		else {
			api.log("Drag'n'Drop -- not supported");
		}
	};


		api.event.dnd.off = function (el, onHover, onDrop){
		_off(el, 'dragenter dragleave dragover', onHover.ff);
		_off(el, 'drop', onDrop.ff);
	};
	if( jQuery && !jQuery.fn.dnd ){
		jQuery.fn.dnd = function (onHover, onDrop){
			return this.each(function (){
				api.event.dnd(this, onHover, onDrop);
			});
		};

		jQuery.fn.offdnd = function (onHover, onDrop){
			return this.each(function (){
				api.event.dnd.off(this, onHover, onDrop);
			});
		};
	}
	window.FileAPI  = _extend(api, window.FileAPI);
	api.log('FileAPI: ' + api.version);
	api.log('protocol: ' + window.location.protocol);
	api.log('doctype: [' + doctype.name + '] ' + doctype.publicId + ' ' + doctype.systemId);
	_each(document.getElementsByTagName('meta'), function (meta){
		if( /x-ua-compatible/i.test(meta.getAttribute('http-equiv')) ){
			api.log('meta.http-equiv: ' + meta.getAttribute('content'));
		}
	});
	if( !api.flashUrl ){ api.flashUrl = api.staticPath + 'FileAPI.flash.swf'; }
	if( !api.flashImageUrl ){ api.flashImageUrl = api.staticPath + 'FileAPI.flash.image.swf'; }
	if( !api.flashWebcamUrl ){ api.flashWebcamUrl = api.staticPath + 'FileAPI.flash.camera.swf'; }
})(window, void 0);

/*global window, FileAPI, document */

(function (api, document, undef) {
	'use strict';

	var
		min = Math.min,
		round = Math.round,
		getCanvas = function () { return document.createElement('canvas'); },
		support = false,
		exifOrientation = {
			  8:	270
			, 3:	180
			, 6:	90
			, 7:	270
			, 4:	180
			, 5:	90
		}
	;

	try {
		support = getCanvas().toDataURL('image/png').indexOf('data:image/png') > -1;
	}
	catch (e){}


	function Image(file){
		if( file instanceof Image ){
			var img = new Image(file.file);
			api.extend(img.matrix, file.matrix);
			return	img;
		}
		else if( !(this instanceof Image) ){
			return	new Image(file);
		}

		this.file   = file;
		this.size   = file.size || 100;

		this.matrix	= {
			sx: 0,
			sy: 0,
			sw: 0,
			sh: 0,
			dx: 0,
			dy: 0,
			dw: 0,
			dh: 0,
			resize: 0, // min, max OR preview
			deg: 0,
			quality: 1, // jpeg quality
			filter: 0
		};
	}


	Image.prototype = {
		image: true,
		constructor: Image,

		set: function (attrs){
			api.extend(this.matrix, attrs);
			return	this;
		},

		crop: function (x, y, w, h){
			if( w === undef ){
				w	= x;
				h	= y;
				x = y = 0;
			}
			return	this.set({ sx: x, sy: y, sw: w, sh: h || w });
		},

		resize: function (w, h, strategy){
			if( /min|max/.test(h) ){
				strategy = h;
				h = w;
			}

			return	this.set({ dw: w, dh: h || w, resize: strategy });
		},

		preview: function (w, h){
			return	this.resize(w, h || w, 'preview');
		},

		rotate: function (deg){
			return	this.set({ deg: deg });
		},

		filter: function (filter){
			return	this.set({ filter: filter });
		},

		overlay: function (images){
			return	this.set({ overlay: images });
		},

		clone: function (){
			return	new Image(this);
		},

		_load: function (image, fn){
			var self = this;

			if( /img|video/i.test(image.nodeName) ){
				fn.call(self, null, image);
			}
			else {
				api.readAsImage(image, function (evt){
					fn.call(self, evt.type != 'load', evt.result);
				});
			}
		},

		_apply: function (image, fn){
			var
				  canvas = getCanvas()
				, m = this.getMatrix(image)
				, ctx = canvas.getContext('2d')
				, width = image.videoWidth || image.width
				, height = image.videoHeight || image.height
				, deg = m.deg
				, dw = m.dw
				, dh = m.dh
				, w = width
				, h = height
				, filter = m.filter
				, copy // canvas copy
				, buffer = image
				, overlay = m.overlay
				, queue = api.queue(function (){ image.src = api.EMPTY_PNG; fn(false, canvas); })
				, renderImageToCanvas = api.renderImageToCanvas
			;
			deg = deg - Math.floor(deg/360)*360;
			image._type = this.file.type;

			while(m.multipass && min(w/dw, h/dh) > 2 ){
				w = (w/2 + 0.5)|0;
				h = (h/2 + 0.5)|0;

				copy = getCanvas();
				copy.width  = w;
				copy.height = h;

				if( buffer !== image ){
					renderImageToCanvas(copy, buffer, 0, 0, buffer.width, buffer.height, 0, 0, w, h);
					buffer = copy;
				}
				else {
					buffer = copy;
					renderImageToCanvas(buffer, image, m.sx, m.sy, m.sw, m.sh, 0, 0, w, h);
					m.sx = m.sy = m.sw = m.sh = 0;
				}
			}


			canvas.width  = (deg % 180) ? dh : dw;
			canvas.height = (deg % 180) ? dw : dh;

			canvas.type = m.type;
			canvas.quality = m.quality;

			ctx.rotate(deg * Math.PI / 180);
			renderImageToCanvas(ctx.canvas, buffer
				, m.sx, m.sy
				, m.sw || buffer.width
				, m.sh || buffer.height
				, (deg == 180 || deg == 270 ? -dw : 0)
				, (deg == 90 || deg == 180 ? -dh : 0)
				, dw, dh
			);
			dw = canvas.width;
			dh = canvas.height;
			overlay && api.each([].concat(overlay), function (over){
				queue.inc();
				var img = new window.Image, fn = function (){
					var
						  x = over.x|0
						, y = over.y|0
						, w = over.w || img.width
						, h = over.h || img.height
						, rel = over.rel
					;
					x = (rel == 1 || rel == 4 || rel == 7) ? (dw - w + x)/2 : (rel == 2 || rel == 5 || rel == 8 ? dw - (w + x) : x);
					y = (rel == 3 || rel == 4 || rel == 5) ? (dh - h + y)/2 : (rel >= 6 ? dh - (h + y) : y);

					api.event.off(img, 'error load abort', fn);

					try {
						ctx.globalAlpha = over.opacity || 1;
						ctx.drawImage(img, x, y, w, h);
					}
					catch (er){}

					queue.next();
				};

				api.event.on(img, 'error load abort', fn);
				img.src = over.src;

				if( img.complete ){
					fn();
				}
			});

			if( filter ){
				queue.inc();
				Image.applyFilter(canvas, filter, queue.next);
			}

			queue.check();
		},

		getMatrix: function (image){
			var
				  m  = api.extend({}, this.matrix)
				, sw = m.sw = m.sw || image.videoWidth || image.naturalWidth ||  image.width
				, sh = m.sh = m.sh || image.videoHeight || image.naturalHeight || image.height
				, dw = m.dw = m.dw || sw
				, dh = m.dh = m.dh || sh
				, sf = sw/sh, df = dw/dh
				, strategy = m.resize
			;

			if( strategy == 'preview' ){
				if( dw != sw || dh != sh ){
					var w, h;

					if( df >= sf ){
						w	= sw;
						h	= w / df;
					} else {
						h	= sh;
						w	= h * df;
					}

					if( w != sw || h != sh ){
						m.sx	= ~~((sw - w)/2);
						m.sy	= ~~((sh - h)/2);
						sw		= w;
						sh		= h;
					}
				}
			}
			else if( strategy ){
				if( !(sw > dw || sh > dh) ){
					dw = sw;
					dh = sh;
				}
				else if( strategy == 'min' ){
					dw = round(sf < df ? min(sw, dw) : dh*sf);
					dh = round(sf < df ? dw/sf : min(sh, dh));
				}
				else {
					dw = round(sf >= df ? min(sw, dw) : dh*sf);
					dh = round(sf >= df ? dw/sf : min(sh, dh));
				}
			}

			m.sw = sw;
			m.sh = sh;
			m.dw = dw;
			m.dh = dh;
			m.multipass = api.multiPassResize;
			return	m;
		},

		_trans: function (fn){
			this._load(this.file, function (err, image){
				if( err ){
					fn(err);
				}
				else {
					try {
						this._apply(image, fn);
					} catch (err){
						api.log('[err] FileAPI.Image.fn._apply:', err);
						fn(err);
					}
				}
			});
		},


		get: function (fn){
			if( api.support.transform ){
				var _this = this, matrix = _this.matrix;

				if( matrix.deg == 'auto' ){
					api.getInfo(_this.file, function (err, info){
						matrix.deg = exifOrientation[info && info.exif && info.exif.Orientation] || 0;
						_this._trans(fn);
					});
				}
				else {
					_this._trans(fn);
				}
			}
			else {
				fn('not_support_transform');
			}

			return this;
		},


		toData: function (fn){
			return this.get(fn);
		}

	};


	Image.exifOrientation = exifOrientation;


	Image.transform = function (file, transform, autoOrientation, fn){
		function _transform(err, img){
			var
				  images = {}
				, queue = api.queue(function (err){
					fn(err, images);
				})
			;

			if( !err ){
				api.each(transform, function (params, name){
					if( !queue.isFail() ){
						var ImgTrans = new Image(img.nodeType ? img : file), isFn = typeof params == 'function';

						if( isFn ){
							params(img, ImgTrans);
						}
						else if( params.width ){
							ImgTrans[params.preview ? 'preview' : 'resize'](params.width, params.height, params.strategy);
						}
						else {
							if( params.maxWidth && (img.width > params.maxWidth || img.height > params.maxHeight) ){
								ImgTrans.resize(params.maxWidth, params.maxHeight, 'max');
							}
						}

						if( params.crop ){
							var crop = params.crop;
							ImgTrans.crop(crop.x|0, crop.y|0, crop.w || crop.width, crop.h || crop.height);
						}

						if( params.rotate === undef && autoOrientation ){
							params.rotate = 'auto';
						}

						ImgTrans.set({ type: ImgTrans.matrix.type || params.type || file.type || 'image/png' });

						if( !isFn ){
							ImgTrans.set({
								  deg: params.rotate
								, overlay: params.overlay
								, filter: params.filter
								, quality: params.quality || 1
							});
						}

						queue.inc();
						ImgTrans.toData(function (err, image){
							if( err ){
								queue.fail();
							}
							else {
								images[name] = image;
								queue.next();
							}
						});
					}
				});
			}
			else {
				queue.fail();
			}
		}
		if( file.width ){
			_transform(false, file);
		} else {
			api.getInfo(file, _transform);
		}
	};
	api.each(['TOP', 'CENTER', 'BOTTOM'], function (x, i){
		api.each(['LEFT', 'CENTER', 'RIGHT'], function (y, j){
			Image[x+'_'+y] = i*3 + j;
			Image[y+'_'+x] = i*3 + j;
		});
	});


		Image.toCanvas = function(el){
		var canvas		= document.createElement('canvas');
		canvas.width	= el.videoWidth || el.width;
		canvas.height	= el.videoHeight || el.height;
		canvas.getContext('2d').drawImage(el, 0, 0);
		return	canvas;
	};


		Image.fromDataURL = function (dataURL, size, callback){
		var img = api.newImage(dataURL);
		api.extend(img, size);
		callback(img);
	};


		Image.applyFilter = function (canvas, filter, doneFn){
		if( typeof filter == 'function' ){
			filter(canvas, doneFn);
		}
		else if( window.Caman ){
			window.Caman(canvas.tagName == 'IMG' ? Image.toCanvas(canvas) : canvas, function (){
				if( typeof filter == 'string' ){
					this[filter]();
				}
				else {
					api.each(filter, function (val, method){
						this[method](val);
					}, this);
				}
				this.render(doneFn);
			});
		}
	};


		api.renderImageToCanvas = function (canvas, img, sx, sy, sw, sh, dx, dy, dw, dh){
		try {
			return canvas.getContext('2d').drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
		} catch (ex) {
			api.log('renderImageToCanvas failed');
			throw ex;
		}
	};
	api.support.canvas = api.support.transform = support;
	api.Image = Image;
})(FileAPI, document);

/*
 * JavaScript Load Image iOS scaling fixes 1.0.3
 * https://github.com/blueimp/JavaScript-Load-Image
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * iOS image scaling fixes based on
 * https://github.com/stomita/ios-imagefile-megapixel
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, bitwise: true */
/*global FileAPI, window, document */

(function (factory) {
	'use strict';
	factory(FileAPI);
}(function (loadImage) {
    'use strict';
    if (!window.navigator || !window.navigator.platform ||
             !(/iP(hone|od|ad)/).test(window.navigator.platform)) {
        return;
    }

    var originalRenderMethod = loadImage.renderImageToCanvas;
    loadImage.detectSubsampling = function (img) {
        var canvas,
            context;
        if (img.width * img.height > 1024 * 1024) { // only consider mexapixel images
            canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            context = canvas.getContext('2d');
            context.drawImage(img, -img.width + 1, 0);
            return context.getImageData(0, 0, 1, 1).data[3] === 0;
        }
        return false;
    };
    loadImage.detectVerticalSquash = function (img, subsampled) {
        var naturalHeight = img.naturalHeight || img.height,
            canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            data,
            sy,
            ey,
            py,
            alpha;
        if (subsampled) {
            naturalHeight /= 2;
        }
        canvas.width = 1;
        canvas.height = naturalHeight;
        context.drawImage(img, 0, 0);
        data = context.getImageData(0, 0, 1, naturalHeight).data;
        sy = 0;
        ey = naturalHeight;
        py = naturalHeight;
        while (py > sy) {
            alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        return (py / naturalHeight) || 1;
    };
    loadImage.renderImageToCanvas = function (
        canvas,
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight
    ) {
        if (img._type === 'image/jpeg') {
            var context = canvas.getContext('2d'),
                tmpCanvas = document.createElement('canvas'),
                tileSize = 1024,
                tmpContext = tmpCanvas.getContext('2d'),
                subsampled,
                vertSquashRatio,
                tileX,
                tileY;
            tmpCanvas.width = tileSize;
            tmpCanvas.height = tileSize;
            context.save();
            subsampled = loadImage.detectSubsampling(img);
            if (subsampled) {
                sourceX /= 2;
                sourceY /= 2;
                sourceWidth /= 2;
                sourceHeight /= 2;
            }
            vertSquashRatio = loadImage.detectVerticalSquash(img, subsampled);
            if (subsampled || vertSquashRatio !== 1) {
                sourceY *= vertSquashRatio;
                destWidth = Math.ceil(tileSize * destWidth / sourceWidth);
                destHeight = Math.ceil(
                    tileSize * destHeight / sourceHeight / vertSquashRatio
                );
                destY = 0;
                tileY = 0;
                while (tileY < sourceHeight) {
                    destX = 0;
                    tileX = 0;
                    while (tileX < sourceWidth) {
                        tmpContext.clearRect(0, 0, tileSize, tileSize);
                        tmpContext.drawImage(
                            img,
                            sourceX,
                            sourceY,
                            sourceWidth,
                            sourceHeight,
                            -tileX,
                            -tileY,
                            sourceWidth,
                            sourceHeight
                        );
                        context.drawImage(
                            tmpCanvas,
                            0,
                            0,
                            tileSize,
                            tileSize,
                            destX,
                            destY,
                            destWidth,
                            destHeight
                        );
                        tileX += tileSize;
                        destX += destWidth;
                    }
                    tileY += tileSize;
                    destY += destHeight;
                }
                context.restore();
                return canvas;
            }
        }
        return originalRenderMethod(
            canvas,
            img,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            destX,
            destY,
            destWidth,
            destHeight
        );
    };

}));

/*global window, FileAPI */

(function (api, window){
	"use strict";

	var
		  document = window.document
		, FormData = window.FormData
		, Form = function (){ this.items = []; }
		, encodeURIComponent = window.encodeURIComponent
	;


	Form.prototype = {

		append: function (name, blob, file, type){
			this.items.push({
				  name: name
				, blob: blob && blob.blob || (blob == void 0 ? '' : blob)
				, file: blob && (file || blob.name)
				, type:	blob && (type || blob.type)
			});
		},

		each: function (fn){
			var i = 0, n = this.items.length;
			for( ; i < n; i++ ){
				fn.call(this, this.items[i]);
			}
		},

		toData: function (fn, options){
		    options._chunked = api.support.chunked && options.chunkSize > 0 && api.filter(this.items, function (item){ return item.file; }).length == 1;

			if( !api.support.html5 ){
				api.log('FileAPI.Form.toHtmlData');
				this.toHtmlData(fn);
			}
			else if( !api.formData || this.multipart || !FormData ){
				api.log('FileAPI.Form.toMultipartData');
				this.toMultipartData(fn);
			}
			else if( options._chunked ){
				api.log('FileAPI.Form.toPlainData');
				this.toPlainData(fn);
			}
			else {
				api.log('FileAPI.Form.toFormData');
				this.toFormData(fn);
			}
		},

		_to: function (data, complete, next, arg){
			var queue = api.queue(function (){
				complete(data);
			});

			this.each(function (file){
				next(file, data, queue, arg);
			});

			queue.check();
		},


		toHtmlData: function (fn){
			this._to(document.createDocumentFragment(), fn, function (file, data
(function (window, api){
	"use strict";

	var
		  noop = function (){}
		, document = window.document

		, XHR = function (options){
			this.uid = api.uid();
			this.xhr = {
				  abort: noop
				, getResponseHeader: noop
				, getAllResponseHeaders: noop
			};
			this.options = options;
		},

		_xhrResponsePostfix = { '': 1, XML: 1, Text: 1, Body: 1 }
	;


	XHR.prototype = {
		status: 0,
		statusText: '',
		constructor: XHR,

		getResponseHeader: function (name){
			return this.xhr.getResponseHeader(name);
		},

		getAllResponseHeaders: function (){
			return this.xhr.getAllResponseHeaders() || {};
		},

		end: function (status, statusText){
			var _this = this, options = _this.options;

			_this.end		=
			_this.abort		= noop;
			_this.status	= status;

			if( statusText ){
				_this.statusText = statusText;
			}

			api.log('xhr.end:', status, statusText);
			options.complete(status == 200 || status == 201 ? false : _this.statusText || 'unknown', _this);

			if( _this.xhr && _this.xhr.node ){
				setTimeout(function (){
					var node = _this.xhr.node;
					try { node.parentNode.removeChild(node); } catch (e){}
					try { delete window[_this.uid]; } catch (e){}
					window[_this.uid] = _this.xhr.node = null;
				}, 9);
			}
		},

		abort: function (){
			this.end(0, 'abort');

			if( this.xhr ){
				this.xhr.aborted = true;
				this.xhr.abort();
			}
		},

		send: function (FormData){
			var _this = this, options = this.options;

			FormData.toData(function (data){
				options.upload(options, _this);
				_this._send.call(_this, options, data);
			}, options);
		},

		_send: function (options, data){
			var _this = this, xhr, uid = _this.uid, onloadFuncName = _this.uid + "Load", url = options.url;

			api.log('XHR._send:', data);

			if( !options.cache ){
				url += (~url.indexOf('?') ? '&' : '?') + api.uid();
			}

			if( data.nodeName ){
				var jsonp = options.jsonp;
				url = url.replace(/([a-z]+)=(\?)/i, '$1='+uid);
				options.upload(options, _this);

				var
					onPostMessage = function (evt){
						if( ~url.indexOf(evt.origin) ){
							try {
								var result = api.parseJSON(evt.data);
								if( result.id == uid ){
									complete(result.status, result.statusText, result.response);
								}
							} catch( err ){
								complete(0, err.message);
							}
						}
					},
					complete = window[uid] = function (status, statusText, response){
						_this.readyState	= 4;
						_this.responseText	= response;
						_this.end(status, statusText);

						api.event.off(window, 'message', onPostMessage);
						window[uid] = xhr = transport = window[onloadFuncName] = null;
					}
				;

				_this.xhr.abort = function (){
					try {
						if( transport.stop ){ transport.stop(); }
						else if( transport.contentWindow.stop ){ transport.contentWindow.stop(); }
						else { transport.contentWindow.document.execCommand('Stop'); }
					}
					catch (er) {}
					complete(0, "abort");
				};

				api.event.on(window, 'message', onPostMessage);

				window[onloadFuncName] = function (){
					try {
						var
							  win = transport.contentWindow
							, doc = win.document
							, result = win.result || api.parseJSON(doc.body.innerHTML)
						;
						complete(result.status, result.statusText, result.response);
					} catch (e){
						api.log('[transport.onload]', e);
					}
				};

				xhr = document.createElement('div');
				xhr.innerHTML = '<form target="'+ uid +'" action="'+ url +'" method="POST" enctype="multipart/form-data" style="position: absolute; top: -1000px; overflow: hidden; width: 1px; height: 1px;">'
							+ '<iframe name="'+ uid +'" src="javascript:false;" onload="' + onloadFuncName + '()"></iframe>'
							+ (jsonp && (options.url.indexOf('=?') < 0) ? '<input value="'+ uid +'" name="'+jsonp+'" type="hidden"/>' : '')
							+ '</form>'
				;
				var
					  form = xhr.getElementsByTagName('form')[0]
					, transport = xhr.getElementsByTagName('iframe')[0]
				;

				form.appendChild(data);

				api.log(form.parentNode.innerHTML);
				document.body.appendChild(xhr);
				_this.xhr.node = xhr;
				_this.readyState = 2; // loaded
				form.submit();
				form = null;
			}
			else {
				url = url.replace(/([a-z]+)=(\?)&?/i, '');
				if (this.xhr && this.xhr.aborted) {
					api.log("Error: already aborted");
					return;
				}
				xhr = _this.xhr = api.getXHR();

				if (data.params) {
					url += (url.indexOf('?') < 0 ? "?" : "&") + data.params.join("&");
				}

				xhr.open('POST', url, true);

				if( api.withCredentials ){
					xhr.withCredentials = "true";
				}

				if( !options.headers || !options.headers['X-Requested-With'] ){
					xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				}

				api.each(options.headers, function (val, key){
					xhr.setRequestHeader(key, val);
				});


				if ( options._chunked ) {
					if( xhr.upload ){
						xhr.upload.addEventListener('progress', api.throttle(function (						if( xhr.sendAsBinary ){
							xhr.sendAsBinary(rawData);
						}
						else {
							var bytes = Array.prototype.map.call(rawData, function(c){ return c.charCodeAt(0) & 0xff; });
							xhr.send(new Uint8Array(bytes).buffer);

						}
					} else {
						xhr.send(data);
					}
				}
			}
		}
	};
	api.XHR = XHR;
})(window, FileAPI);


/*global window, FileAPI, jQuery */
(function (window, api){
	"use strict";

	var
		URL = window.URL || window.webkitURL,

		document = window.document,
		navigator = window.navigator,

		getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia,

		html5 = !!getMedia
	;
	api.support.media = html5;


	var Camera = function (video){
		this.video = video;
	};


	Camera.prototype = {
		isActive: function (){
			return	!!this._active;
		},


				start: function (callback){
			var
				  _this = this
				, video = _this.video
				, _successId
				, _failId
				, _complete = function (err){
					_this._active = !err;
					clearTimeout(_failId);
					clearTimeout(_successId);
					callback && callback(err, _this);
				}
			;

			getMedia.call(navigator, { video: true }, function (stream		stop: function (){
			try {
				this._active = false;
				this.video.pause();
				this.stream.stop();
			} catch( err ){ }
		},


				shot: function (){
			return	new Shot(this.video);
		}
	};


		Camera.get = function (el){
		return	new Camera(el.firstChild);
	};


		Camera.publish = function (el, options, callback){
		if( typeof options == 'function' ){
			callback = options;
			options = {};
		}
		options = api.extend({}, {
			  width:	'100%'
			, height:	'100%'
			, start:	true
		}, options);


		if( el.jquery ){
			el = el[0];
		}


		var doneFn = function (err){
			if( err ){
				callback(err);
			}
			else {
				var cam = Camera.get(el);
				if( options.start ){
					cam.start(callback);
				}
				else {
					callback(null, cam);
				}
			}
		};


		el.style.width	= _px(options.width);
		el.style.height	= _px(options.height);


		if( api.html5 && html5 ){
			var video = document.createElement('video');
			video.style.width	= _px(options.width);
			video.style.height	= _px(options.height);
			if( window.jQuery ){
				jQuery(el).empty();
			} else {
				el.innerHTML = '';
			}
			el.appendChild(video);
			doneFn();
		}
		else {
			Camera.fallback(el, options, doneFn);
		}
	};


	Camera.fallback = function (el, options, callback){
		callback('not_support_camera');
	};


		var Shot = function (video){
		var canvas	= video.nodeName ? api.Image.toCanvas(video) : video;
		var shot	= api.Image(canvas);
		shot.type	= 'image/png';
		shot.width	= canvas.width;
		shot.height	= canvas.height;
		shot.size	= canvas.width * canvas.height * 4;
		return	shot;
	};


		function _px(val){
		return	val >= 0 ? val + 'px' : val;
	}


		function _detectVideoSignal(video){
		var canvas = document.createElement('canvas'), ctx, res = false;
		try {
			ctx = canvas.getContext('2d');
			ctx.drawImage(video, 0, 0, 1, 1);
			res = ctx.getImageData(0, 0, 1, 1).data[4] != 255;
		}
		catch( e ){}
		return	res;
	}
	Camera.Shot	= Shot;
	api.Camera	= Camera;
})(window, FileAPI);


/*global window, ActiveXObject, FileAPI */
(function (window, jQuery, api) {
	"use strict";

	var
		  document = window.document
		, location = window.location
		, navigator = window.navigator
		, _each = api.each
	;


	api.support.flash = (function (){
		var mime = navigator.mimeTypes, has = false;

		if( navigator.plugins && typeof navigator.plugins['Shockwave Flash'] == 'object' ){
			has	= navigator.plugins['Shockwave Flash'].description && !(mime && mime['application/x-shockwave-flash'] && !mime['application/x-shockwave-flash'].enabledPlugin);
		}
		else {
			try {
				has	= !!(window.ActiveXObject && new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
			}
			catch(er){
				api.log('Flash -- does not supported.');
			}
		}

		if( has && /^file:/i.test(location) ){
			api.log('[warn] Flash does not work on `file:` protocol.');
		}

		return	has;
	})();


	   api.support.flash
	&& (0
		|| !api.html5 || !api.support.html5
		|| (api.cors && !api.support.cors)
		|| (api.media && !api.support.media)
	)
	&& (function (){
		var
			  _attr  = api.uid()
			, _retry = 0
			, _files = {}
			, _rhttp = /^https?:/i

			, flash = {
				_fn: {},


								init: function (){
					var child = document.body && document.body.firstChild;

					if( child ){
						do {
							if( child.nodeType == 1 ){
								api.log('FlashAPI.state: awaiting');

								var dummy = document.createElement('div');

								dummy.id = '_' + _attr;

								_css(dummy, {
									  top: 1
									, right: 1
									, width: 5
									, height: 5
									, position: 'absolute'
									, zIndex: 1e6+'' // set max zIndex
								});

								child.parentNode.insertBefore(dummy, child);
								flash.publish(dummy, _attr);

								return;
							}
						}
						while( child = child.nextSibling );
					}

					if( _retry < 10 ){
						setTimeout(flash.init, ++_retry*50);
					}
				},


								publish: function (el, id, opts){
					opts = opts || {};
					el.innerHTML = _makeFlashHTML({
						  id: id
						, src: _getUrl(api.flashUrl, 'r=' + api.version)
						, wmode: opts.camera ? '' : 'transparent'
						, flashvars: 'callback=' + (opts.onEvent || 'FileAPI.Flash.onEvent')
							+ '&flashId='+ id
							+ '&storeKey='+ navigator.userAgent.match(/\d/ig).join('') +'_'+ api.version
							+ (flash.isReady || (api.pingUrl ? '&ping='+api.pingUrl : ''))
							+ '&timeout='+api.flashAbortTimeout
							+ (opts.camera ? '&useCamera=' + _getUrl(api.flashWebcamUrl) : '')
							+ '&debug='+(api.debug?"1":"")
					}, opts);
				},


				ready: function (){
					api.log('FlashAPI.state: ready');

					flash.ready = api.F;
					flash.isReady = true;
					flash.patch();
					flash.patchCamera && flash.patchCamera();
					api.event.on(document, 'mouseover', flash.mouseover);
					api.event.on(document, 'click', function (evt){
						if( flash.mouseover(evt) ){
							evt.preventDefault
								? evt.preventDefault()
								: (evt.returnValue = true)
							;
						}
					});
				},


				getEl: function (){
					return	document.getElementById('_'+_attr);
				},


				getWrapper: function (node){
					do {
						if( /js-fileapi-wrapper/.test(node.className) ){
							return	node;
						}
					}
					while( (node = node.parentNode) && (node !== document.body) );
				},
				
				disableMouseover: false,

				mouseover: function (evt){
					if (!flash.disableMouseover) {
						var target = api.event.fix(evt).target;
	
						if( /input/i.test(target.nodeName) && target.type == 'file' && !target.disabled ){
							var
								  state = target.getAttribute(_attr)
								, wrapper = flash.getWrapper(target)
							;
	
							if( api.multiFlash ){
								if( state == 'i' || state == 'r' ){
									return	false;
								}
								else if( state != 'p' ){
									target.setAttribute(_attr, 'i');
	
									var dummy = document.createElement('div');
	
									if( !wrapper ){
										api.log('[err] FlashAPI.mouseover: js-fileapi-wrapper not found');
										return;
									}
	
									_css(dummy, {
										  top:    0
										, left:   0
										, width:  target.offsetWidth
										, height: target.offsetHeight
										, zIndex: 1e6+'' // set max zIndex
										, position: 'absolute'
									});
	
									wrapper.appendChild(dummy);
									flash.publish(dummy, api.uid());
									target.setAttribute(_attr, 'p');
								}
	
								return	true;
							}
							else if( wrapper ){
								var box = _getDimensions(wrapper);
								_css(flash.getEl(), box);
								flash.curInp = target;
							}
						}
						else if( !/object|embed/i.test(target.nodeName) ){
							_css(flash.getEl(), { top: 1, left: 1, width: 5, height: 5 });
						}
					}
				},

				onEvent: function (evt){
					var type = evt.type;
					
					if( type == 'ready' ){
						try {
							flash.getInput(evt.flashId).setAttribute(_attr, 'r');
						} catch (e){
						}

						flash.ready();
						setTimeout(function (){ flash.mouseenter(evt); }, 50);
						return	true;
					}
					else if( type === 'ping' ){
						api.log('(flash -> js).ping:', [evt.status, evt.savedStatus], evt.error);
					}
					else if( type === 'log' ){
						api.log('(flash -> js).log:', evt.target);
					}
					else if( type in flash ){
						setTimeout(function (){
							api.log('FlashAPI.event.'+evt.type+':', evt);
							flash[type](evt);
						}, 1);
					}
				},
				mouseDown: function(evt) {
					flash.disableMouseover = true;
				},
				cancel: function(evt) {
					flash.disableMouseover = false;
				},
				mouseenter: function (evt){
					var node = flash.getInput(evt.flashId);

					if( node ){
						flash.cmd(evt, 'multiple', node.getAttribute('multiple') != null);
						var accept = [], exts = {};

						_each((node.getAttribute('accept') || '').split(/,\s*/), function (mime){
							api.accept[mime] && _each(api.accept[mime].split(' '), function (ext){
								exts[ext] = 1;
							});
						});

						_each(exts, function (i, ext){
							accept.push( ext );
						});

						flash.cmd(evt, 'accept', accept.length ? accept.join(',')+','+accept.join(',').toUpperCase() : '*');
					}
				},


				get: function (id){
					return	document[id] || window[id] || document.embeds[id];
				},


				getInput: function (id){
					if( api.multiFlash ){
						try {
							var node = flash.getWrapper(flash.get(id));
							if( node ){
								return node.getElementsByTagName('input')[0];
							}
						} catch (e){
							api.log('[err] Can not find "input" by flashId:', id, e);
						}
					} else {
						return	flash.curInp;
					}
				},


				select: function (evt){
					try {
						var
							  inp = flash.getInput(evt.flashId)
							, uid = api.uid(inp)
							, files = evt.target.files
							, event
						;
						_each(files, function (file){
							api.checkFileObj(file);
						});
	
						_files[uid] = files;
	
						if( document.createEvent ){
							event = document.createEvent('Event');
							event.files = files;
							event.initEvent('change', true, true);
							inp.dispatchEvent(event);
						}
						else if( jQuery ){
							jQuery(inp).trigger({ type: 'change', files: files });
						}
						else {
							event = document.createEventObject();
							event.files = files;
							inp.fireEvent('onchange', event);
						}
					} finally {
						flash.disableMouseover = false;
					}
				},


				cmd: function (id, name, data, last){
					try {
						api.log('(js -> flash).'+name+':', data);
						return flash.get(id.flashId || id).cmd(name, data);
					} catch (e){
						api.log('(js -> flash).onError:', e);
						if( !last ){
							setTimeout(function (){ flash.cmd(id, name, data, true); }, 50);
						}
					}
				},


				patch: function (){
					api.flashEngine = true;
					_inherit(api, {
						getFiles: function (input, filter, callback){
							if( callback ){
								api.filterFiles(api.getFiles(input), filter, callback);
								return null;
							}

							var files = api.isArray(input) ? input : _files[api.uid(input.target || input.srcElement || input)];


							if( !files ){
								return	this.parent.apply(this, arguments);
							}


							if( filter ){
								filter	= api.getFilesFilter(filter);
								files	= api.filter(files, function (file){ return filter.test(file.name); });
							}

							return	files;
						},


						getInfo: function (file, fn){
							if( _isHtmlFile(file) ){
								this.parent.apply(this, arguments);
							}
							else if( file.isShot ){
								fn(null, file.info = {
									width: file.width,
									height: file.height
								});
							}
							else {
								if( !file.__info ){
									var defer = file.__info = api.defer();
									defer.resolve(null, file.info = null);

								}

								file.__info.then(fn);
							}
						}
					});
					api.support.transform = true;
					api.Image && _inherit(api.Image.prototype, {
						get: function (fn, scaleMode){
							this.set({ scaleMode: scaleMode || 'noScale' }); // noScale, exactFit
							return this.parent(fn);
						},

						_load: function (file, fn){
							api.log('FlashAPI.Image._load:', file);

							if( _isHtmlFile(file) ){
								this.parent.apply(this, arguments);
							}
							else {
								var _this = this;
								api.getInfo(file, function (err){
									fn.call(_this, err, file);
								});
							}
						},

						_apply: function (file, fn){
							api.log('FlashAPI.Image._apply:', file);

							if( _isHtmlFile(file) ){
								this.parent.apply(this, arguments);
							}
							else {
								var m = this.getMatrix(file.info), doneFn = fn;

								flash.cmd(file, 'imageTransform', {
									  id: file.id
									, matrix: m
									, callback: _wrap(function _(err, base64){
										api.log('FlashAPI.Image._apply.callback:', err);
										_unwrap(_);

										if( err ){
											doneFn(err);
										}
										else if( !api.support.html5 && (!api.support.dataURI || base64.length > 3e4) ){
											_makeFlashImage({
												  width:	(m.deg % 180) ? m.dh : m.dw
												, height:	(m.deg % 180) ? m.dw : m.dh
												, scale:	m.scaleMode
											}, base64, doneFn);
										}
										else {
											if( m.filter ){
												doneFn = function (err, img){
													if( err ){
														fn(err);
													}
													else {
														api.Image.applyFilter(img, m.filter, function (){
															fn(err, this.canvas);
														});
													}
												};
											}

											api.newImage('data:'+ file.type +';base64,'+ base64, doneFn);
										}
									})
								});
							}
						},

						toData: function (fn){
							var
								  file = this.file
								, info = file.info
								, matrix = this.getMatrix(info)
							;
							api.log('FlashAPI.Image.toData');

							if( _isHtmlFile(file) ){
								this.parent.apply(this, arguments);
							}
							else {
								if( matrix.deg == 'auto' ){
									matrix.deg = api.Image.exifOrientation[info && info.exif && info.exif.Orientation] || 0;
								}

								fn.call(this, !file.info, {
									  id:		file.id
									, flashId:	file.flashId
									, name:		file.name
									, type:		file.type
									, matrix:	matrix
								});
							}
						}
					});


					api.Image && _inherit(api.Image, {
						fromDataURL: function (dataURL, size, callback){
							if( !api.support.dataURI || dataURL.length > 3e4 ){
								_makeFlashImage(
									  api.extend({ scale: 'exactFit' }, size)
									, dataURL.replace(/^data:[^,]+,/, '')
									, function (err, el){ callback(el); }
								);
							}
							else {
								this.parent(dataURL, size, callback);
							}
						}
					});
					_inherit(api.Form.prototype, {
						toData: function (fn){
							var items = this.items, i = items.length;

							for( ; i--; ){
								if( items[i].file && _isHtmlFile(items[i].blob) ){
									return this.parent.apply(this, arguments);
								}
							}

							api.log('FlashAPI.Form.toData');
							fn(items);
						}
					});
					_inherit(api.XHR.prototype, {
						_send: function (options, formData){
							if(
								   formData.nodeName
								|| formData.append && api.support.html5
								|| api.isArray(formData) && (typeof formData[0] === 'string')
							){
								return	this.parent.apply(this, arguments);
							}


							var
								  data = {}
								, files = {}
								, _this = this
								, flashId
								, fileId
							;

							_each(formData, function (item){
								if( item.file ){
									files[item.name] = item = _getFileDescr(item.blob);
									fileId  = item.id;
									flashId = item.flashId;
								}
								else {
									data[item.name] = item.blob;
								}
							});

							if( !fileId ){
								flashId = _attr;
							}

							if( !flashId ){
								api.log('[err] FlashAPI._send: flashId -- undefined');
								return this.parent.apply(this, arguments);
							}
							else {
								api.log('FlashAPI.XHR._send: '+ flashId +' -> '+ fileId);
							}

							_this.xhr = {
								headers: {},
								abort: function (){ flash.cmd(flashId, 'abort', { id: fileId }); },
								getResponseHeader: function (name){ return this.headers[name]; },
								getAllResponseHeaders: function (){ return this.headers; }
							};

							var queue = api.queue(function (){
								flash.cmd(flashId, 'upload', {
									  url: _getUrl(options.url.replace(/([a-z]+)=(\?)&?/i, ''))
									, data: data
									, files: fileId ? files : null
									, headers: options.headers || {}
									, callback: _wrap(function upload(evt){
										var type = evt.type, result = evt.result;

										api.log('FlashAPI.upload.'+type);

										if( type == 'progress' ){
											evt.loaded = Math.min(evt.loaded, evt.total); // @todo fixme
											evt.lengthComputable = true;
											options.progress(evt);
										}
										else if( type == 'complete' ){
											_unwrap(upload);

											if( typeof result == 'string' ){
												_this.responseText	= result.replace(/%22/g, "\"").replace(/%5c/g, "\\").replace(/%26/g, "&").replace(/%25/g, "%");
											}

											_this.end(evt.status || 200);
										}
										else if( type == 'abort' || type == 'error' ){
											_this.end(evt.status || 0, evt.message);
											_unwrap(upload);
										}
									})
								});
							});
							_each(files, function (file){
								queue.inc();
								api.getInfo(file, queue.next);
							});

							queue.check();
						}
					});
				}
			}
		;


		function _makeFlashHTML(opts){
			return ('<object id="#id#" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+(opts.width || '100%')+'" height="'+(opts.height || '100%')+'">'
				+ '<param name="movie" value="#src#" />'
				+ '<param name="flashvars" value="#flashvars#" />'
				+ '<param name="swliveconnect" value="true" />'
				+ '<param name="allowscriptaccess" value="always" />'
				+ '<param name="allownetworking" value="all" />'
				+ '<param name="menu" value="false" />'
				+ '<param name="wmode" value="#wmode#" />'
				+ '<embed flashvars="#flashvars#" swliveconnect="true" allownetworking="all" allowscriptaccess="always" name="#id#" src="#src#" width="'+(opts.width || '100%')+'" height="'+(opts.height || '100%')+'" menu="false" wmode="transparent" type="application/x-shockwave-flash"></embed>'
				+ '</object>').replace(/#(\w+)#/ig, function (a, name){ return opts[name]; })
			;
		}


		function _css(el, css){
			if( el && el.style ){
				var key, val;
				for( key in css ){
					val = css[key];
					if( typeof val == 'number' ){
						val += 'px';
					}
					try { el.style[key] = val; } catch (e) {}
				}
				
			}
		}


		function _inherit(obj, methods){
			_each(methods, function (fn, name){
				var prev = obj[name];
				obj[name] = function (){
					this.parent = prev;
					return fn.apply(this, arguments);
				};
			});
		}

		function _isHtmlFile(file){
			return	file && !file.flashId;
		}

		function _wrap(fn){
			var id = fn.wid = api.uid();
			flash._fn[id] = fn;
			return	'FileAPI.Flash._fn.'+id;
		}


		function _unwrap(fn){
			try {
				flash._fn[fn.wid] = null;
				delete	flash._fn[fn.wid];
			}
			catch(e){}
		}


		function _getUrl(url, params){
			if( !_rhttp.test(url) ){
				if( /^\.\//.test(url) || '/' != url.charAt(0) ){
					var path = location.pathname;
					path = path.substr(0, path.lastIndexOf('/'));
					url = (path +'/'+ url).replace('/./', '/');
				}

				if( '//' != url.substr(0, 2) ){
					url = '//' + location.host + url;
				}

				if( !_rhttp.test(url) ){
					url = location.protocol + url;
				}
			}

			if( params ){
				url += (/\?/.test(url) ? '&' : '?') + params;
			}

			return	url;
		}


		function _makeFlashImage(opts, base64, fn){
			var
				  key
				, flashId = api.uid()
				, el = document.createElement('div')
				, attempts = 10
			;

			for( key in opts ){
				el.setAttribute(key, opts[key]);
				el[key] = opts[key];
			}

			_css(el, opts);

			opts.width	= '100%';
			opts.height	= '100%';

			el.innerHTML = _makeFlashHTML(api.extend({
				  id: flashId
				, src: _getUrl(api.flashImageUrl, 'r='+ api.uid())
				, wmode: 'opaque'
				, flashvars: 'scale='+ opts.scale +'&callback='+_wrap(function _(){
					_unwrap(_);
					if( --attempts > 0 ){
						_setImage();
					}
					return true;
				})
			}, opts));

			function _setImage(){
				try {
					var img = flash.get(flashId);
					img.setImage(base64);
				} catch (e){
					api.log('[err] FlashAPI.Preview.setImage -- can not set "base64":', e);
				}
			}

			fn(false, el);
			el = null;
		}


		function _getFileDescr(file){
			return	{
				  id: file.id
				, name: file.name
				, matrix: file.matrix
				, flashId: file.flashId
			};
		}


		function _getDimensions(el){
			var
				  box = el.getBoundingClientRect()
				, body = document.body
				, docEl = (el && el.ownerDocument).documentElement
			;
			
			function getOffset(obj) {
			    var left, top;
			    left = top = 0;
			    if (obj.offsetParent) {
			        do {
			            left += obj.offsetLeft;
			            top  += obj.offsetTop;
			        } while (obj = obj.offsetParent);
			    }
			    return {
			        left : left,
			        top : top
			    };
			};
			
			return {
				  top:		getOffset(el).top
				, left:		getOffset(el).left
				, width:	el.offsetWidth
				, height:	el.offsetHeight
			};
		}
		api.Flash = flash;
		api.newImage('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', function (err, img){
			api.support.dataURI = !(img.width != 1 || img.height != 1);
			flash.init();
		});
	})();
})(window, window.jQuery, FileAPI);


/*global window, FileAPI */
(function (window, jQuery, api) {
    "use strict";

    var _each = api.each,
        _cameraQueue = [];


    if (api.support.flash && (api.media && !api.support.media)) {
        (function () {

            function _wrap(fn) {
                var id = fn.wid = api.uid();
                api.Flash._fn[id] = fn;
                return 'FileAPI.Flash._fn.' + id;
            }


            function _unwrap(fn) {
                try {
                    api.Flash._fn[fn.wid] = null;
                    delete api.Flash._fn[fn.wid];
                } catch (e) {
                }
            }

            var flash = api.Flash;
            api.extend(api.Flash, {

                patchCamera: function () {
                    api.Camera.fallback = function (el, options, callback) {
                        var camId = api.uid();
                        api.log('FlashAPI.Camera.publish: ' + camId);
                        flash.publish(el, camId, api.extend(options, {
                            camera: true,
                            onEvent: _wrap(function _(evt) {
                                if (evt.type === 'camera') {
                                    _unwrap(_);

                                    if (evt.error) {
                                        api.log('FlashAPI.Camera.publish.error: ' + evt.error);
                                        callback(evt.error);
                                    } else {
                                        api.log('FlashAPI.Camera.publish.success: ' + camId);
                                        callback(null);
                                    }
                                }
                            })
                        }));
                    };
                    _each(_cameraQueue, function (args) {
                        api.Camera.fallback.apply(api.Camera, args);
                    });
                    _cameraQueue = [];
                    api.extend(api.Camera.prototype, {
                        _id: function () {
                            return this.video.id;
                        },

                        start: function (callback) {
                            var _this = this;
                            flash.cmd(this._id(), 'camera.on', {
                                callback: _wrap(function _(evt) {
                                    _unwrap(_);

                                    if (evt.error) {
                                        api.log('FlashAPI.camera.on.error: ' + evt.error);
                                        callback(evt.error, _this);
                                    } else {
                                        api.log('FlashAPI.camera.on.success: ' + _this._id());
                                        _this._active = true;
                                        callback(null, _this);
                                    }
                                })
                            });
                        },

                        stop: function () {
                            this._active = false;
                            flash.cmd(this._id(), 'camera.off');
                        },

                        shot: function () {
                            api.log('FlashAPI.Camera.shot:', this._id());

                            var shot = api.Flash.cmd(this._id(), 'shot', {});
                            shot.type = 'image/png';
                            shot.flashId = this._id();
                            shot.isShot = true;

                            return new api.Camera.Shot(shot);
                        }
                    });
                }
            });

            api.Camera.fallback = function () {
                _cameraQueue.push(arguments);
            };

        }());
    }
}(window, window.jQuery, FileAPI));
if( typeof define === "function" && define.amd ){ define("FileAPI", [], function (){ return FileAPI; }); }