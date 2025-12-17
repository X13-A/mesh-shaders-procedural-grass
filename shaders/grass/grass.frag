#version 450

#include "../shaderInterface.h"

layout(location = 0) in vec3 fragWorldPos;
layout(location = 1) in vec3 fragNormal;
layout(location = 2) in vec2 fragTexCoord;

layout(location = 0) out vec4 outColor;

void main() {
    vec3 normal = normalize(fragNormal);
    vec3 grassColor = shadingUbo.diffuse;

    if (shadingUbo.doShading) {
        // Darker at bottom
        vec3 tipColor = grassColor + vec3(0.1, 0.1, 0.1);
        grassColor = mix(grassColor, tipColor, fragTexCoord.y);
        
        vec3 ambient = shadingUbo.ambient * grassColor;
        vec3 diffuse = globalShadingUbo.lightColor * grassColor;
        
        vec3 finalColor = ambient + diffuse;
        outColor = vec4(finalColor, 1.0);
    } else {
        outColor = vec4(fragTexCoord.y, 0.0, 0.0, 1.0);
    }
}