'use strict';

/**
 * External dependencies
 */
const _ = require('lodash');
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {hooks} = wp;
const {addFilter} = hooks;
const {createHigherOrderComponent} = wp.compose;

import {Fragment, useState, useEffect} from '@wordpress/element';

import {
	PanelBody, PanelRow, ColorPalette, SelectControl, RadioControl,
} from '@wordpress/components';
import {InspectorControls} from '@wordpress/block-editor';

/**
 * Internal variables
 */
const blockName = 'core/button';

/**
 * Add custom attributes to the block
 *
 * @param { Object } settings Original block settings
 * @param { string } name     Block name
 *
 * @return { Object }         Filtered block settings
 */
const addAttributes = (settings, name) => {
	if (name !== blockName) {
		return settings;
	}

	// Modify settings for button.
	settings.attributes = _.merge(settings.attributes, {
		backgroundHoverColor: {
			type: 'string',
		},
		backgroundHoverSlug: {
			type: 'string',
		},
		textHoverColor: {
			type: 'string',
		},
		textHoverSlug: {
			type: 'string',
		},
		borderHoverColor: {
			type: 'string',
		},
		borderHoverSlug: {
			type: 'string',
		},
		buttonIcon: {
			type: 'string',
			default: 'none',
		},
		buttonIconPosition: {
			type: 'string',
			default: 'left',
		},
	});

	return settings;
};

hooks.addFilter('blocks.registerBlockType', blockName, addAttributes);

/**
 * Add custom controls to the block
 */
const registerFields = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (blockName !== props.name) {
			return <BlockEdit { ...props } />;
		}

		const {attributes, setAttributes} = props;
		const {
			backgroundHoverColor,
			backgroundHoverSlug,
			textHoverColor,
			textHoverSlug,
			borderHoverColor,
			borderHoverSlug,
			buttonIcon,
			buttonIconPosition,
		} = attributes;
		const [currentColorPalette, currentColorPaletteChange] = useState('');

		const buttonClasses = classnames(props.className, {
			'has-icon': buttonIcon && buttonIcon !== 'none',
			[ `has-icon-${ buttonIcon }` ]: buttonIcon && buttonIcon !== 'none',
			[ `icon-position-${ buttonIconPosition }` ]: buttonIconPosition && buttonIconPosition !== 'none',
		});

		// Save colors.
		useEffect(() => {
			currentColorPaletteChange(
				wp.data.select('core/editor').getEditorSettings().colors);
		}, [currentColorPalette]);

		const icons = {
			study: `<svg width="22" height="18" viewBox="0 0 22 18" fill="none">
    <path
      d="M11 0L0 6L11 12L20 7.09V14H22V6M4 10.18V14.18L11 18L18 14.18V10.18L11 14L4 10.18Z"
      fill="currentColor"
    />
  </svg>`,
			download: `<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.687 14.5928C8.5956 14.5005 8.48681 14.4272 8.36691 14.3772C8.24702 14.3272 8.1184 14.3014 7.9885 14.3014C7.8586 14.3014 7.72998 14.3272 7.61009 14.3772C7.49019 14.4272 7.3814 14.5005 7.29 14.5928C7.10466 14.78 7.0007 15.0328 7.0007 15.2963C7.0007 15.5597 7.10466 15.8125 7.29 15.9998L9.254 17.9798C9.35461 18.0814 9.47438 18.1621 9.60638 18.2172C9.73837 18.2723 9.87998 18.3006 10.023 18.3006C10.166 18.3006 10.3076 18.2723 10.4396 18.2172C10.5716 18.1621 10.6914 18.0814 10.792 17.9798L12.711 16.0468C12.8966 15.8595 13.0008 15.6065 13.0008 15.3428C13.0008 15.0791 12.8966 14.8261 12.711 14.6388C12.6196 14.5463 12.5107 14.4729 12.3907 14.4228C12.2708 14.3727 12.142 14.3469 12.012 14.3469C11.882 14.3469 11.7532 14.3727 11.6333 14.4228C11.5133 14.4729 11.4044 14.5463 11.313 14.6388L10.023 15.9388L8.687 14.5928Z" fill="currentColor"/>
			<path d="M11.001 17.2938L11 7.30678C11 6.75178 10.552 6.30078 10 6.30078C9.448 6.30078 9 6.75078 9 7.30778L9.001 17.2948C9.001 17.8498 9.449 18.3008 10.001 18.3008C10.553 18.3008 11.001 17.8508 11.001 17.2938Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.938 2.78078C5.68111 2.73908 5.42125 2.71835 5.161 2.71878C2.356 2.71878 0 4.92078 0 7.79878C0 10.7098 2.385 13.3008 5.1 13.3008H7.981V11.3078H5.1C3.443 11.3078 1.985 9.64478 1.985 7.79978C1.985 6.02178 3.454 4.71278 5.089 4.71278H5.101C5.49 4.71278 5.787 4.76278 6.071 4.86278L6.241 4.92578C6.846 5.17378 7.116 4.67978 7.116 4.67978L7.266 4.41278C7.996 3.06578 9.467 2.31678 10.982 2.29278C11.9871 2.30282 12.9543 2.6782 13.703 3.3489C14.4517 4.0196 14.9309 4.93979 15.051 5.93778L15.097 6.27778C15.097 6.27778 15.168 6.80278 15.762 6.80278C15.775 6.80278 15.774 6.80778 15.785 6.80778H16.039C17.175 6.80778 18.015 7.76678 18.015 8.96578C18.015 10.1728 17.028 11.3078 15.945 11.3078H11.981V13.3008H15.945C18.105 13.3008 20 11.2558 20 8.96578C20 6.96578 18.688 5.30278 16.862 4.89178C16.155 2.18478 13.809 0.339781 10.976 0.300781C9.001 0.320781 7.075 1.20078 5.938 2.78078Z" fill="currentColor"/>
			</svg>`,
			pdf: `<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.12116 9.15152H16.8697C16.9692 9.15152 17.0645 9.11202 17.1349 9.0417C17.2052 8.97138 17.2447 8.876 17.2447 8.77655V6.15179C17.2448 6.05328 17.2254 5.95572 17.1878 5.86468C17.1502 5.77365 17.0949 5.69092 17.0253 5.62122L11.7758 0.371699C11.7061 0.302079 11.6234 0.246874 11.5323 0.209236C11.4413 0.171599 11.3437 0.152267 11.2452 0.152344H2.24605C1.84827 0.152344 1.46677 0.310365 1.18549 0.591644C0.904211 0.872922 0.746191 1.25442 0.746191 1.65221V8.77655C0.746191 8.876 0.785696 8.97138 0.856016 9.0417C0.926335 9.11202 1.02171 9.15152 1.12116 9.15152ZM11.2452 2.02717L15.3699 6.15179H11.2452V2.02717ZM17.254 12.2009C17.2372 12.3937 17.1482 12.573 17.0048 12.7028C16.8614 12.8327 16.6741 12.9036 16.4807 12.9012H14.9949V14.401H15.7289C15.9224 14.3984 16.1097 14.4692 16.2532 14.5991C16.3967 14.729 16.4857 14.9084 16.5022 15.1013C16.509 15.2039 16.4947 15.3068 16.4601 15.4036C16.4254 15.5004 16.3713 15.589 16.3009 15.664C16.2306 15.739 16.1456 15.7987 16.0512 15.8395C15.9569 15.8802 15.8551 15.9011 15.7523 15.9009H14.9949V17.3755C14.9975 17.569 14.9267 17.7563 14.7968 17.8998C14.6669 18.0433 14.4875 18.1323 14.2946 18.1488C14.1921 18.1556 14.0892 18.1413 13.9924 18.1067C13.8956 18.072 13.8069 18.0179 13.7319 17.9475C13.6569 17.8772 13.5972 17.7922 13.5565 17.6978C13.5157 17.6034 13.4948 17.5017 13.495 17.3989V12.1512C13.495 11.9524 13.574 11.7616 13.7147 11.621C13.8553 11.4803 14.0461 11.4013 14.245 11.4013H16.5041C16.6069 11.4011 16.7087 11.422 16.803 11.4628C16.8974 11.5035 16.9824 11.5632 17.0527 11.6382C17.1231 11.7132 17.1772 11.8019 17.2119 11.8987C17.2465 11.9955 17.2608 12.0983 17.254 12.2009ZM2.99598 11.4013H1.49612C1.29723 11.4013 1.10648 11.4803 0.965841 11.621C0.825201 11.7616 0.746191 11.9524 0.746191 12.1512V17.3755C0.743107 17.5693 0.813661 17.7571 0.94362 17.901C1.07358 18.0449 1.25327 18.1341 1.44644 18.1507C1.54902 18.1575 1.65191 18.1432 1.74871 18.1085C1.84551 18.0739 1.93415 18.0197 2.00914 17.9494C2.08413 17.8791 2.14385 17.7941 2.18461 17.6997C2.22537 17.6053 2.24628 17.5036 2.24605 17.4008V16.6508H2.93974C4.36836 16.6508 5.57762 15.5334 5.61981 14.1058C5.63048 13.7545 5.5705 13.4047 5.44344 13.077C5.31637 12.7494 5.12481 12.4506 4.88011 12.1984C4.63541 11.9462 4.34255 11.7456 4.0189 11.6087C3.69525 11.4718 3.3474 11.4013 2.99598 11.4013ZM2.96318 15.151H2.24605V12.9012H2.99598C3.15332 12.9004 3.30906 12.9327 3.45315 12.9959C3.59723 13.0591 3.72645 13.1519 3.83247 13.2681C3.93848 13.3844 4.01892 13.5216 4.0686 13.6709C4.11828 13.8202 4.13609 13.9782 4.12088 14.1348C4.08815 14.4175 3.95159 14.678 3.73768 14.8658C3.52378 15.0536 3.24776 15.1552 2.96318 15.151ZM8.99544 11.4013H7.49557C7.29668 11.4013 7.10593 11.4803 6.96529 11.621C6.82465 11.7616 6.74564 11.9524 6.74564 12.1512V17.4008C6.74564 17.5997 6.82465 17.7904 6.96529 17.931C7.10593 18.0717 7.29668 18.1507 7.49557 18.1507H8.93169C10.7746 18.1507 12.3261 16.6996 12.3692 14.8576C12.3801 14.4077 12.3008 13.9601 12.1362 13.5413C11.9715 13.1224 11.7248 12.7408 11.4104 12.4187C11.096 12.0967 10.7204 11.8408 10.3057 11.666C9.89097 11.4913 9.44547 11.4013 8.99544 11.4013ZM8.9495 16.6508H8.2455V12.9012H8.99544C9.24784 12.901 9.49767 12.9518 9.72997 13.0505C9.96228 13.1492 10.1723 13.2938 10.3473 13.4756C10.5224 13.6574 10.659 13.8727 10.7488 14.1085C10.8387 14.3444 10.88 14.596 10.8703 14.8482C10.8309 15.8625 9.96472 16.6508 8.9495 16.6508Z" fill="currentColor"/>
</svg>`,
			calendar: `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.505 2.46484H16.5V3.46484C16.5 4.56984 15.612 5.46484 14.5 5.46484C13.395 5.46484 12.5 4.57684 12.5 3.46484V2.46484H6.5V3.46484C6.5 4.56984 5.612 5.46484 4.5 5.46484C3.395 5.46484 2.5 4.57684 2.5 3.46484V2.46484H2.495C1.392 2.46484 0.5 3.35784 0.5 4.45884V16.4708C0.500265 16.9998 0.710569 17.507 1.08468 17.8809C1.45878 18.2548 1.96607 18.4648 2.495 18.4648H16.505C16.7669 18.465 17.0263 18.4135 17.2684 18.3133C17.5104 18.2132 17.7304 18.0663 17.9156 17.8812C18.1009 17.696 18.2478 17.4761 18.3481 17.2341C18.4484 16.9922 18.5 16.7328 18.5 16.4708V4.45884C18.5 3.35984 17.607 2.46484 16.505 2.46484ZM6.5 10.4658H4.5V8.46484H6.5V10.4658ZM6.5 14.4658H4.5V12.4648H6.5V14.4658ZM10.5 10.4658H8.5V8.46484H10.5V10.4658ZM10.5 14.4658H8.5V12.4648H10.5V14.4658ZM14.5 10.4658H12.5V8.46484H14.5V10.4658ZM14.5 14.4658H12.5V12.4648H14.5V14.4658Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 3.46484V2.46484H15.5V3.46484C15.5 3.73006 15.3946 3.98441 15.2071 4.17195C15.0196 4.35949 14.7652 4.46484 14.5 4.46484C14.2348 4.46484 13.9804 4.35949 13.7929 4.17195C13.6054 3.98441 13.5 3.73006 13.5 3.46484ZM13.5 1.46484C13.5 1.19963 13.6054 0.945273 13.7929 0.757737C13.9804 0.570201 14.2348 0.464844 14.5 0.464844C14.7652 0.464844 15.0196 0.570201 15.2071 0.757737C15.3946 0.945273 15.5 1.19963 15.5 1.46484V2.46484H13.5V1.46484ZM3.5 1.46484C3.5 1.19963 3.60536 0.945273 3.79289 0.757737C3.98043 0.570201 4.23478 0.464844 4.5 0.464844C4.76522 0.464844 5.01957 0.570201 5.20711 0.757737C5.39464 0.945273 5.5 1.19963 5.5 1.46484V2.46484H3.5V1.46484ZM3.5 3.46484V2.46484H5.5V3.46484C5.5 3.73006 5.39464 3.98441 5.20711 4.17195C5.01957 4.35949 4.76522 4.46484 4.5 4.46484C4.23478 4.46484 3.98043 4.35949 3.79289 4.17195C3.60536 3.98441 3.5 3.73006 3.5 3.46484Z" fill="currentColor"/>
</svg>`,
			libra: `<svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 0C10.9142 0 11.25 0.33579 11.25 0.75V1.83383L16.6552 3.01621C16.6693 3.01919 16.6833 3.02257 16.6971 3.02635C16.8543 3.06901 16.987 3.15939 17.0831 3.27821C17.1004 3.29967 17.1165 3.32205 17.1314 3.34525C17.1388 3.35681 17.1459 3.36857 17.1527 3.38052L20.1512 8.6279C20.2159 8.7412 20.25 8.8695 20.25 9C20.25 10.9107 18.593 12.75 16.5 12.75C14.407 12.75 12.75 10.9107 12.75 9C12.75 8.8695 12.7841 8.7412 12.8488 8.6279L15.3422 4.26447L11.25 3.3693V15.75H15C15.4142 15.75 15.75 16.0858 15.75 16.5C15.75 16.9142 15.4142 17.25 15 17.25H10.5H6C5.58579 17.25 5.25 16.9142 5.25 16.5C5.25 16.0858 5.58579 15.75 6 15.75H9.75V3.3693L5.65779 4.26447L8.15118 8.6279C8.21594 8.7412 8.25 8.8695 8.25 9C8.25 10.9107 6.59302 12.75 4.5 12.75C2.40698 12.75 0.75 10.9107 0.75 9C0.75 8.8695 0.78406 8.7412 0.84882 8.6279L3.84721 3.38071C3.85143 3.37326 3.85577 3.36589 3.86023 3.35859C3.87258 3.33841 3.8858 3.31893 3.89984 3.3002C3.99688 3.17059 4.13609 3.07167 4.30274 3.02639C4.31664 3.0226 4.33067 3.0192 4.34482 3.01621L9.75 1.83383V0.75C9.75 0.33579 10.0858 0 10.5 0ZM16.5 11.25C15.3456 11.25 14.3624 10.2456 14.259 9.1835L16.5 5.26167L18.741 9.1835C18.6376 10.2456 17.6544 11.25 16.5 11.25ZM2.25898 9.1835C2.36241 10.2456 3.34563 11.25 4.5 11.25C5.65437 11.25 6.63759 10.2456 6.74102 9.1835L4.5 5.26167L2.25898 9.1835Z" fill="currentColor"/>
</svg> `,
			check: `<svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.23635 4.32241C2.0558 4.1304 1.80675 4.01743 1.54335 4.00806C1.27996 3.99869 1.02351 4.09369 0.829783 4.27239C0.636054 4.4511 0.520709 4.69906 0.50883 4.96235C0.49695 5.22565 0.589497 5.48299 0.766345 5.67841L4.37835 9.59741C4.91535 10.1234 5.71535 10.1234 6.21235 9.62741L6.57634 9.26841C7.89088 7.97564 9.20388 6.6813 10.5153 5.38541L10.5553 5.34541C11.781 4.13748 13.0004 2.92313 14.2133 1.70241C14.3946 1.51261 14.494 1.25915 14.4901 0.996709C14.4861 0.734272 14.3792 0.483904 14.1923 0.299629C14.0054 0.115354 13.7535 0.0119463 13.4911 0.0117191C13.2286 0.0114919 12.9766 0.114463 12.7893 0.298415C11.582 1.51275 10.3687 2.7211 9.14935 3.92341L9.10935 3.96341C7.85262 5.20571 6.59428 6.44638 5.33435 7.68541L2.23635 4.32241Z" fill="currentColor"/></svg>`,
			phone: `<svg width="17" height="7" viewBox="0 0 17 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.86669 6.21591L4.47769 5.55991C4.47769 5.55991 5.11769 5.32291 5.12969 4.58191L5.11969 3.36991C5.11969 3.36991 5.15769 2.89891 5.75669 2.81291C7.52469 2.48591 9.17469 2.47291 10.9387 2.81291C11.6277 2.94391 11.5747 3.36991 11.5747 3.36991L11.5817 4.25891C11.5947 4.99891 12.2337 5.23591 12.2337 5.23591L14.8267 6.21791C16.0537 6.5879 16.6947 4.74491 16.2667 3.64391C15.2757 1.08691 12.2707 0.649905 9.98569 0.349905C8.90069 0.206905 7.69469 0.272905 6.71169 0.349905C4.99169 0.486905 1.54169 1.06291 0.546689 3.61991C0.119689 4.71991 0.639689 6.58591 1.86669 6.21591Z" fill="#3876FF"/>
</svg>`,

		};

		return (
			<Fragment>

				<InspectorControls>
					<PanelBody
						title={ 'Button Icon' }
						initialOpen={ true }
					>

						<SelectControl
							label={ 'Select Icon' }
							value={ buttonIcon }
							options={ [
								{label: 'None', value: 'none'},
								{label: 'Study', value: 'study'},
								{label: 'Download', value: 'download'},
								{label: 'PDF', value: 'pdf'},
								{label: 'Calendar', value: 'calendar'},
								{label: 'Libra', value: 'libra'},
								{label: 'Check mark', value: 'check'},
								{label: 'Phone', value: 'phone'},
							] }
							onChange={ (value) => setAttributes({buttonIcon: value}) }
						/>

						{ buttonIcon && buttonIcon !== 'none' &&
							(
								<div>
									Icon Preview: &nbsp;
									<span
										dangerouslySetInnerHTML={ {
											__html: icons[ buttonIcon ] || '', // Render the selected icon
										} }
									/>
								</div>
							)
						}

						{ buttonIcon && buttonIcon !== 'none' && (
							<>
								<br />
								<RadioControl
									label="Select Icon Position"
									onChange={ (value) => setAttributes({buttonIconPosition: value}) }
									options={ [
										{label: 'Left', value: 'left'},
										{label: 'Right', value: 'right'},
									] }
									selected={ buttonIconPosition }
								/>
							</>
						) }

						<br />
						<p>Notice: On the website frontend, the icon will mimic the color of the button text.</p>

					</PanelBody>
				</InspectorControls>

				<InspectorControls group="styles">
					<PanelBody
						title={ 'Background Hover Color' }
						initialOpen={ false }
					>
						<PanelRow>
							<ColorPalette
								colors={ currentColorPalette }
								disableCustomColors={ true }
								clearable={ true }
								onChange={ (val, i) => {
									if (typeof val === 'undefined') {
										setAttributes({backgroundHoverSlug: ''});
										setAttributes({backgroundHoverColor: ''});
									} else {
										setAttributes({backgroundHoverSlug: currentColorPalette[ i ].slug});
										setAttributes({backgroundHoverColor: val});
									}
								} }
								value={ backgroundHoverColor }
							/>
						</PanelRow>
					</PanelBody>
					<PanelBody
						title={ 'Text Hover Color' }
						initialOpen={ false }
					>
						<PanelRow>
							<ColorPalette
								colors={ currentColorPalette }
								disableCustomColors={ true }
								clearable={ true }
								onChange={ (val, i) => {
									if (typeof val === 'undefined') {
										setAttributes({textHoverSlug: ''});
										setAttributes({textHoverColor: ''});
									} else {
										setAttributes({textHoverSlug: currentColorPalette[ i ].slug});
										setAttributes({textHoverColor: val});
									}
								} }
								value={ textHoverColor }
							/>
						</PanelRow>
					</PanelBody>
					<PanelBody
						title={ 'Border Hover Color' }
						initialOpen={ false }
					>
						<PanelRow>
							<ColorPalette
								colors={ currentColorPalette }
								disableCustomColors={ true }
								clearable={ true }
								onChange={ (val, i) => {
									if (typeof val === 'undefined') {
										setAttributes({borderHoverSlug: ''});
										setAttributes({borderHoverColor: ''});
									} else {
										setAttributes({borderHoverSlug: currentColorPalette[ i ].slug});
										setAttributes({borderHoverColor: val});
									}
								} }
								value={ borderHoverColor }
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>

				<BlockEdit { ...props } className={ buttonClasses } />

			</Fragment>
		);
	};
});

hooks.addFilter('editor.BlockEdit', blockName, registerFields);

/**
 * Add custom attributes to the block on the FRONT-END
 *
 * @param { Object } props      Additional props applied to save element.
 * @param { Object } block      Block type.
 * @param { Object } attributes Current block attributes.
 * @return { Object }           Filtered props applied to save element.
 */
const addCustomAttributesToFrontEnd = (props, block, attributes) => {
	if (block.name !== blockName) {
		return props;
	}

	const {className} = props;
	const {
		backgroundHoverSlug,
		textHoverSlug,
		borderHoverSlug,
		buttonIcon,
		buttonIconPosition,
	} = attributes;

	props.className = classnames(
		className,
		textHoverSlug ? `has-${ textHoverSlug }-hover-color` : '',
		backgroundHoverSlug ? `has-${ backgroundHoverSlug }-background-hover-color` : '',
		borderHoverSlug ? `has-${ borderHoverSlug }-border-hover-color` : '',
		(buttonIcon && buttonIcon !== 'none') ? `has-icon has-icon-${ buttonIcon }` : '',
		(buttonIconPosition && buttonIcon !== 'none') ? `icon-position-${ buttonIcon }` : '',
	);

	return props;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	blockName,
	addCustomAttributesToFrontEnd,
);
