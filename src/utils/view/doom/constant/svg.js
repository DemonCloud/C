import { _lock } from "../../../usestruct";

// use with document.createElementNS(namespace, tagName)
export const SVG_XML_NAMESPACE = "http://www.w3.org/2000/svg";

// SVG tagName mapping in render Template
export const SVG_TAGNAMES_MAPPING = _lock({
  "svg-a": "a",
  "animate": "animate",
  "animatemotion": "animateMotion",
  "animateMotion": "animateMotion",
  "animatetransform": "animateTransform",
  "animateTransform": "animateTransform",
  "circle": "circle",
  "clipPath": "clipPath",
  "color-profile": "color-profile",
  "defs": "defs",
  "desc": "desc",
  "discard": "discard",
  "ellipse": "ellipse",
  "feblend": "feBlend",
  "feBlend": "feBlend",
  "feColorMatrix": "feColorMatrix",
  "fecolormatrix": "feColorMatrix",
  "fecomponenttransfer": "feComponentTransfer",
  "feComponentTransfer": "feComponentTransfer",
  "fecomposite": "feComposite",
  "feComposite": "feComposite",
  "feconvolvematrix": "feConvolveMatrix",
  "feConvolveMatrix": "feConvolveMatrix",
  "fediffuselighting": "feDiffuseLighting",
  "feDiffuseLighting": "feDiffuseLighting",
  "fedistantlight": "feDistantLight",
  "feDistantLight": "feDistantLight",
  "fedropshadow": "feDropShadow",
  "feDropShadow": "feDropShadow",
  "feflood": "feFlood",
  "feFlood": "feFlood",
  "fefunca": "feFuncA",
  "feFuncA": "feFuncA",
  "fefuncb": "feFuncB",
  "feFuncB": "feFuncB",
  "fefuncg": "feFuncG",
  "feFuncG": "feFuncG",
  "fefuncr": "feFuncR",
  "feFuncR": "feFuncR",
  "fegaussianblur": "feGaussianBlur",
  "feGaussianBlur": "feGaussianBlur",
  "feimage": "feImage",
  "feImage": "feImage",
  "femerge": "feMerge",
  "feMerge": "feMerge",
  "femergenode": "feMergeNode",
  "feMergeNode": "feMergeNode",
  "femorphology": "feMorphology",
  "feMorphology": "feMorphology",
  "feoffset": "feOffset",
  "feOffset": "feOffset",
  "fepointlight": "fePointLight",
  "fePointLight": "fePointLight",
  "fespecularlighting": "feSpecularLighting",
  "feSpecularLighting": "feSpecularLighting",
  "fespotlight": "feSpotLight",
  "feSpotLight": "feSpotLight",
  "fetile": "feTile",
  "feTile": "feTile",
  "feturbulence": "feTurbulence",
  "feTurbulence": "feTurbulence",
  "filter": "filter",
  "foreignobject": "foreignObject",
  "foreignObject": "foreignObject",
  "g": "g",
  "hatch": "hatch",
  "hatchpath": "hatchpath",
  "svg-image": "image",
  "line": "line",
  "lineargradient": "linearGradient",
  "linearGradient": "linearGradient",
  "marker": "marker",
  "mask": "mask",
  "mesh": "mesh",
  "meshgradient": "meshgradient",
  "meshpatch": "meshpatch",
  "meshrow": "meshrow",
  "metadata": "metadata",
  "mpath": "mpath",
  "path": "path",
  "pattern" : "pattern",
  "polygon": "polygon",
  "polyline": "polyline",
  "radialgradient": "radialgradient",
  "radialGradient": "radialGradient",
  "rect": "rect",
  "svg-script": "script",
  "set": "set",
  "solidcolor": "solidcolor",
  "stop": "stop",
  "svg-style": "style",
  "svg": "svg",
  "switch": "switch",
  "symbol": "symbol",
  "text": "text",
  "textpath": "textPath",
  "textPath": "textPath",
  "svg-title": "title",
  "tspan": "tspan",
  "unknown": "unknown",
  "use": "use",
  "view": "view",
});