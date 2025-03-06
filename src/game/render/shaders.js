import { THREE, CSMShader } from '../../base/three-defs.js';


class ShaderManager {
  static shaderCode = {};
  static threejs = null;
};

export function SetThreeJS(threejs) {
  ShaderManager.threejs = threejs;
}

export async function loadShaders() {
  const loadText = async (url) => {
    const d = await fetch(url);
    return await d.text();
  };

  const globalShaders = [
    'header.glsl',
    'common.glsl',
    'oklab.glsl',
    'noise.glsl',
    'sky.glsl',
  ];

  const globalShadersCode = [];
  for (let i = 0; i < globalShaders.length; ++i) {
    globalShadersCode.push(await loadText('./public/shaders/' + globalShaders[i]));
  }

  const loadShader = async (url) => {
    const d = await fetch(url);
    let shaderCode = '';
    for (let i = 0; i < globalShadersCode.length; ++i) {
      shaderCode += globalShadersCode[i] + '\n';
    }
    return shaderCode + '\n' + await d.text();
  }

  ShaderManager.shaderCode['PHONG'] = {
    vsh: await loadShader('./public/shaders/phong-lighting-model-vsh.glsl'),
    fsh: await loadShader('./public/shaders/phong-lighting-model-fsh.glsl'),
  };

  ShaderManager.shaderCode['GRASS'] = {
    vsh: await loadShader('./public/shaders/grass-lighting-model-vsh.glsl'),
    fsh: await loadShader('./public/shaders/grass-lighting-model-fsh.glsl'),
  };

  ShaderManager.shaderCode['TERRAIN'] = {
    vsh: await loadShader('./public/shaders/terrain-lighting-model-vsh.glsl'),
    fsh: await loadShader('./public/shaders/terrain-lighting-model-fsh.glsl'),
  };

  ShaderManager.shaderCode['BUGS'] = {
    vsh: await loadShader('./public/shaders/bugs-lighting-model-vsh.glsl'),
    fsh: await loadShader('./public/shaders/bugs-lighting-model-fsh.glsl'),
  };

  ShaderManager.shaderCode['WIND'] = {
    vsh: await loadShader('./public/shaders/wind-lighting-model-vsh.glsl'),
    fsh: await loadShader('./public/shaders/wind-lighting-model-fsh.glsl'),
  };

  ShaderManager.shaderCode['SKY'] = {
    vsh: await loadShader('./public/shaders/sky-lighting-model-vsh.glsl'),
    fsh: await loadShader('./public/shaders/sky-lighting-model-fsh.glsl'),
  };

  ShaderManager.shaderCode['WATER'] = {
    vsh: await loadShader('./public/shaders/water-lighting-model-vsh.glsl'),
    fsh: await loadShader('./public/shaders/water-lighting-model-fsh.glsl'),
  };

  ShaderManager.shaderCode['WATER-TEXTURE'] = {
    vsh: await loadShader('./public/shaders/water-texture-vsh.glsl'),
    fsh: await loadShader('./public/shaders/water-texture-fsh.glsl'),
  };
} 


export class ShaderMaterial extends THREE.ShaderMaterial {
  constructor(shaderType, parameters) {
    parameters.vertexShader = ShaderManager.shaderCode[shaderType].vsh;
    parameters.fragmentShader = ShaderManager.shaderCode[shaderType].fsh;

    super(parameters);
  }
};

export class GamePBRMaterial extends THREE.MeshStandardMaterial {

  #uniforms_ = {};
  #shader_ = null;

  constructor(shaderType, parameters) {
    super(parameters);

    this.#shader_ = null;
    this.#uniforms_ = {};

    ShaderManager.threejs.SetupMaterial(this);

    const previousCallback = this.onBeforeCompile;
    
    this.onBeforeCompile = (shader) => {
        shader.fragmentShader = ShaderManager.shaderCode[shaderType].fsh;
        shader.vertexShader = ShaderManager.shaderCode[shaderType].vsh;
        shader.uniforms.time = { value: 0.0 };
        shader.uniforms.playerPos = { value: new THREE.Vector3(0.0) };

        for (let k in this.#uniforms_) {
          shader.uniforms[k] = this.#uniforms_[k];
        }

        this.#shader_ = shader;

        previousCallback(shader);
    };

    this.onBeforeRender = () => {
      if (shaderType == 'BUGS') {
        let a = 0;
      }
      let a = 0;
    }

    this.customProgramCacheKey = () => {
      let uniformStr = '';
      for (let k in this.#uniforms_) {
        uniformStr += k + ':' + this.#uniforms_[k].value + ';';
      }
      return shaderType + uniformStr;
    }
  }

  setFloat(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec2(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec3(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec4(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setMatrix(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setTexture(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setTextureArray(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }
}

export class GameMaterial extends THREE.MeshPhongMaterial {

  #uniforms_ = {};
  #shader_ = null;

  constructor(shaderType, parameters) {
    super(parameters);

    this.#shader_ = null;
    this.#uniforms_ = {};

    ShaderManager.threejs.SetupMaterial(this);

    const previousCallback = this.onBeforeCompile;

    this.onBeforeCompile = (shader) => {
        shader.fragmentShader = ShaderManager.shaderCode[shaderType].fsh;
        shader.vertexShader = ShaderManager.shaderCode[shaderType].vsh;
        shader.uniforms.time = { value: 0.0 };
        shader.uniforms.playerPos = { value: new THREE.Vector3(0.0) };

        for (let k in this.#uniforms_) {
          shader.uniforms[k] = this.#uniforms_[k];
        }

        this.#shader_ = shader;

        previousCallback(shader);
    };

    this.onBeforeRender = () => {
      if (shaderType == 'BUGS') {
        let a = 0;
      }
      let a = 0;
    }

    this.customProgramCacheKey = () => {
      let uniformStr = '';
      for (let k in this.#uniforms_) {
        uniformStr += k + ':' + this.#uniforms_[k].value + ';';
      }
      return shaderType + uniformStr;
    }
  }

  setFloat(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec2(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec3(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setVec4(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setMatrix(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setTexture(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }

  setTextureArray(name, value) {
    this.#uniforms_[name] = { value: value };
    if (this.#shader_) {
      this.#shader_.uniforms[name] = this.#uniforms_[name];
    }
  }
}


