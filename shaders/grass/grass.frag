#version 450

#include "../shaderInterface.h"
#include "../shading.glsl"

layout(location = 0) in vec3 fragWorldPos;
layout(location = 1) in vec3 fragNormal;
layout(location = 2) in vec2 fragTexCoord;
layout(location = 3) flat in uint inPrimitiveID;

layout(location = 0) out vec4 outColor;
void main() {
    vec3 normal = -normalize(fragNormal);
    if (!gl_FrontFacing) {
        normal = -normal;
    }

    // Color gradient along the blade
    // TODO: make root of the blade have the same color of the ground
    vec3 baseColor = shadingUbo.diffuse;
    vec3 tipColor = baseColor + vec3(0.1, 0.1, 0.1);
    vec3 grassColor = mix(baseColor, tipColor, fragTexCoord.y);

    if (shadingUbo.doShading) {
        // Use the shared shading() function
        vec3 shaded = shading(
            fragWorldPos,         // worldPos
            normal,               // normal
            fragTexCoord,         // localUv
            fragTexCoord,         // baseUV (use same as local for grass)
            shadingUbo.doAo       // allowAO
        );
        // Modulate with grass color gradient
        outColor = vec4(shaded * grassColor, 1.0);
    } else {
        vec3 color = vec3(float(inPrimitiveID % 3 == 0), float(inPrimitiveID % 3 == 1), float(inPrimitiveID % 3 == 2));
        outColor = vec4(color, 1.0);
    }
}