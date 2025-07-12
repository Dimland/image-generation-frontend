import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleGenerateImage = async () => {
    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await axios.get('/api/ImageGeneration/generate', {
        params: {
          prompt: prompt,
          width: 1024,
          height: 1024,
          model: 'flux',
        },
        responseType: 'blob',
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); 
      };
      reader.readAsDataURL(response.data); 

      setGeneratedPrompt(prompt); 

    } catch (err) {
      setError('Error during generation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Image generator</h1>
      <textarea
        rows="6"
        placeholder="Enter prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      <button onClick={handleGenerateImage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate image'}
      </button>

      {loading && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {}
          <img 
            src="/assets/loading.gif" 
            alt="loading gif"
            style={{
              width: '50%', 
              height: 'auto',
            }}
          />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {imageUrl && (
        <div>
          <p><strong>Generated Image based on prompt:</strong> {generatedPrompt}</p>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', marginTop: '20px' }} />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;