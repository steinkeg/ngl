/**
 * @file GUI
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */


NGL.Widget = function(){

};

NGL.Widget.prototype = {

};


NGL.ViewportWidget = function( stage ){

    var viewer = stage.viewer;
    var renderer = viewer.renderer;

    var container = new UI.Panel();
    container.setPosition( 'absolute' );

    viewer.container = container.dom;
    container.dom.appendChild( renderer.domElement );


    // event handlers

    container.dom.addEventListener( 'dragover', function( e ){

        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

    }, false );

    container.dom.addEventListener( 'drop', function( e ){

        e.stopPropagation();
        e.preventDefault();

        var fileList = e.dataTransfer.files;
        var n = fileList.length;

        for( var i=0; i<n; ++i ){

            stage.loadFile( fileList[ i ] );

        }

    }, false );


    return container;

};


NGL.ToolbarWidget = function( stage ){

    var container = new UI.Panel();

    

    return container;

};


NGL.MenubarWidget = function( stage ){

    var container = new UI.Panel();

    container.add( new NGL.MenubarFileWidget( stage ) );
    container.add( new NGL.MenubarViewWidget( stage ) );
    container.add( new NGL.MenubarExampleWidget( stage ) );
    container.add( new NGL.MenubarHelpWidget( stage ) );

    return container;

};


NGL.MenubarFileWidget = function( stage ){

    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.style = "visibility:hidden";
    fileInput.addEventListener( 'change', function( e ){

        var fileList = e.target.files;
        var n = fileList.length;

        for( var i=0; i<n; ++i ){

            addFile( fileList[ i ] );

        }

    }, false );

    function addFile( path ){

        stage.loadFile( path );

    }

    // event handlers

    function onOpenOptionClick () {

        fileInput.dispatchEvent( new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        }));

    }

    function onExportImageOptionClick () {

        window.open(
            stage.viewer.getImage(),
            "NGL_screenshot_" + THREE.Math.generateUUID()
        );

    }

    function onPdbInputKeyDown ( e ) {

        if( e.keyCode === 13 ){

            addFile( e.target.value );
            e.target.value = "";

        }

    }

    // configure menu contents

    var createOption = UI.MenubarHelper.createOption;
    var createInput = UI.MenubarHelper.createInput;
    var createDivider = UI.MenubarHelper.createDivider;

    var menuConfig = [
        createOption( 'Open', onOpenOptionClick ),
        createInput( 'PDB', onPdbInputKeyDown ),
        createDivider(),
        createOption( 'Export image', onExportImageOptionClick ),
    ];

    var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

    return UI.MenubarHelper.createMenuContainer( 'File', optionsPanel );

};


NGL.MenubarViewWidget = function( stage ){

    function setTheme( value ) {

        document.getElementById( 'theme' ).href = value;

    }

    // event handlers

    function onLightThemeOptionClick () {

        setTheme( '../css/light.css' );
        // editor.config.setKey( 'theme', 'css/light.css' );

    }

    function onDarkThemeOptionClick () {

        setTheme( '../css/dark.css' );
        // editor.config.setKey( 'theme', 'css/dark.css' );

    }

    function onFullScreenOptionClick () {

        stage.viewer.fullscreen();

    }

    // configure menu contents

    var createOption = UI.MenubarHelper.createOption;
    var createDivider = UI.MenubarHelper.createDivider;

    var menuConfig = [
        createOption( 'Light theme', onLightThemeOptionClick ),
        createOption( 'Dark theme', onDarkThemeOptionClick ),
        createDivider(),
        createOption( 'Full screen', onFullScreenOptionClick )
    ];

    var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

    return UI.MenubarHelper.createMenuContainer( 'View', optionsPanel );

};


NGL.MenubarExampleWidget = function( stage ){

    // event handlers

    function makeOnFileClick( file ) {

        return function(){

            stage.loadFile( '../data/' + file );

        }

    }

    // configure menu contents

    var createOption = UI.MenubarHelper.createOption;
    var createDivider = UI.MenubarHelper.createDivider;

    var menuConfig = [
        createOption( '1r6a.pdb', makeOnFileClick( '1R6A.pdb' ) ),
        createOption( '1blu.pdb', makeOnFileClick( '1blu.pdb' ) ),
        createOption( '1crn.pdb', makeOnFileClick( '1crn.pdb' ) ),
        createOption( '1d66.pdb', makeOnFileClick( '1d66.pdb' ) ),
        createOption( '1jj2.pdb', makeOnFileClick( '1jj2.pdb' ) ),
        createOption( '304d.pdb', makeOnFileClick( '304d.pdb' ) ),
        createOption( '3dqb.pdb', makeOnFileClick( '3dqb.pdb' ) ),
        createOption( '3l6q.pdb', makeOnFileClick( '3l6q.pdb' ) ),
        createOption( '3pqr.pdb', makeOnFileClick( '3pqr.pdb' ) ),
        createOption( '3sn6.pdb', makeOnFileClick( '3sn6.pdb' ) ),
        createOption( 'BaceCg.pdb', makeOnFileClick( 'BaceCg.pdb' ) ),
        createOption( 'hem.pdb', makeOnFileClick( 'hem.pdb' ) ),
        createOption( 'md.pdb', makeOnFileClick( 'md.pdb' ) ),

        createDivider(),

        createOption( 'md.gro', makeOnFileClick( 'md.gro' ) ),

        createDivider(),

        createOption( '1crn.obj', makeOnFileClick( '1crn.obj' ) ),
        createOption( '1crn.ply', makeOnFileClick( '1crn.ply' ) ),
        createOption( '3dqb.obj', makeOnFileClick( '3dqb.obj' ) )
    ];

    var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

    return UI.MenubarHelper.createMenuContainer( 'Example', optionsPanel )
        .setWidth( "80px" );

};


NGL.MenubarHelpWidget = function( stage ){

    // event handlers

    function onRcsbPdbOptionClick () {

        window.open( 'http://www.rcsb.org', '_blank' );

    }

    // configure menu contents

    var createOption = UI.MenubarHelper.createOption;
    var createDivider = UI.MenubarHelper.createDivider;

    var menuConfig = [
        createOption( 'RCSB PDB', onRcsbPdbOptionClick )
    ];

    var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

    return UI.MenubarHelper.createMenuContainer( 'Help', optionsPanel );

};


NGL.SidebarWidget = function( stage ){

    var signals = stage.signals;
    var container = new UI.Panel();

    signals.componentAdded.add( function( component ){

        console.log( component );
        container.add( new NGL.ComponentWidget( component, stage ) );

    } );

    return container;

};


NGL.ComponentWidget = function( component, stage ){

    var signals = component.signals;
    var container = new UI.CollapsiblePanel();

    var reprContainer = new UI.Panel();

    signals.representationAdded.add( function( repr ){

        reprContainer.add( new NGL.RepresentationWidget( repr, component ) );
        
    } );

    signals.visibilityChanged.add( function( value ){

        if( value ){
            toggle.removeClass( "eye-slash", "eye" ).addClass( "eye" );
        }else{
            toggle.removeClass( "eye", "eye-slash" ).addClass( "eye-slash" );
        }
        
    } );

    // Actions

    var toggle = new UI.Icon( "eye" )
        .setMarginLeft( "25px" )
        .onClick( function(){

            if( toggle.hasClass( "eye" ) ){
                component.setVisibility( false );
            }else{
                component.setVisibility( true );
            }

        } );

    var center = new UI.Icon( "bullseye" )
        .setMarginLeft( "10px" )
        .onClick( function(){

            component.centerView();

        } );

    var dispose = new UI.Icon( "trash-o" )
        .setMarginLeft( "10px" )
        .onClick( function(){

            stage.removeComponent( component );
            container.dom.parentNode.removeChild( container.dom );

        } );

    var reprOptions = { "": "" };
    for( var key in NGL.representationTypes ){
        reprOptions[ key ] = key;
    }

    var repr = new UI.Select()
        .setWidth( '30px' )
        .setColor( '#444' )
        .setMarginLeft( "30px" )
        .setOptions( reprOptions )
        .onChange( function(){
            component.addRepresentation( repr.getValue() );
            repr.setValue( "" );
        } );

    container.addStatic( new UI.Text( component.name ).setWidth( "100px" ) );
    container.addStatic( toggle );
    container.addStatic( center );
    container.addStatic( dispose );
    container.addStatic( repr );

    // Fill container

    container.add( reprContainer )

    return container;

};


NGL.StructureComponentWidget = function( structure, stage ){

    var container = new UI.Panel();

    

    return container;

};


NGL.SurfaceComponentWidget = function( structure, stage ){

    var container = new UI.Panel();

    

    return container;

};


NGL.RepresentationWidget = function( repr, component ){

    var signals = repr.signals;

    var container = new UI.CollapsiblePanel()
        .setMarginLeft( "20px" );

    signals.visibilityChanged.add( function( value ){

        if( value ){
            toggle.removeClass( "eye-slash", "eye" ).addClass( "eye" );
        }else{
            toggle.removeClass( "eye", "eye-slash" ).addClass( "eye-slash" );
        }
        
    } );

    // Actions

    var toggle = new UI.Icon( "eye" )
        .setMarginLeft( "25px" )
        .onClick( function(){

            if( toggle.hasClass( "eye" ) ){
                repr.setVisibility( false );
            }else{
                repr.setVisibility( true );
            }

        } );

    var dispose = new UI.Icon( "trash-o" )
        .setMarginLeft( "10px" )
        .onClick( function(){

            component.removeRepresentation( repr );
            container.dom.parentNode.removeChild( container.dom );

        } );

    container.addStatic( new UI.Text( repr.name ).setWidth( "80px" ) );
    container.addStatic( toggle );
    container.addStatic( dispose );

    // Add sele

    var seleRow = new UI.Panel();
    var sele = new UI.Input()
        .setWidth( '190px' ).onKeyDown( function( e ){
            
            if( e.keyCode === 13 ){

                repr.changeSelection( e.target.value );

            }

        } );

    if( repr.selection ){
        sele.setValue( repr.selection.selectionStr );
    }
 
    seleRow.add( new UI.Text( 'Sele' ).setWidth( '45px' ) );
    seleRow.add( sele );

    container.add( seleRow );

    return container;

};


NGL.VirtualListWidget = function( items ){

    UI.Element.call( this );

    var dom = document.createElement( 'div' );
    dom.className = 'VirtualList';
    // dom.style.cursor = 'default';
    // dom.style.display = 'inline-block';
    // dom.style.verticalAlign = 'middle';

    this.dom = dom;

    this._items = items;

    this.list = new VirtualList({
        w: 280,
        h: 300,
        itemHeight: 31,
        totalRows: items.length,
        generatorFn: function( index ) {

            var panel = new UI.Panel();
            var text = new UI.Text()
                .setColor( "orange" )
                .setMarginLeft( "10px" )
                .setValue( "ITEM " + items[ index ] );

            panel.add( text );

            return panel.dom;

        }
    });

    console.log( this.dom );
    console.log( this.list );

    this.dom.appendChild( this.list.container );

    return this;

};


// TODO

NGL.TreeWidget = function(){

};

NGL.TreeWidget.prototype = {

};


NGL.GridWidget = function(){

};

NGL.GridWidget.prototype = {

};


NGL.StructureGridWidget = function(){

};

NGL.StructureGridWidget.prototype = {

};


NGL.ComponentGridWidget = function(){

};

NGL.ComponentGridWidget.prototype = {

};

