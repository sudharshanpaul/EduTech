import React, { useState } from 'react';
import { Upload, Send, Loader2 } from 'lucide-react';

const PuzzleSolver = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !problemDescription) {
      setError('Please provide both an image and problem description.');
      return;
    }

    setLoading(true);
    setError('');
    setSolution('');

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('problem_description', problemDescription);

    try {
      const response = await fetch('http://127.0.0.1:8005/solve-puzzle', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate solution');
      }

      const data = await response.json();
      setSolution(data.solution);
    } catch (err) {
      setError(err.message || 'Failed to get solution. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">🖼️ AI Puzzle Solver</h1>

        <div className="space-y-4">
          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload an image</span>
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 max-h-64 mx-auto rounded-lg"
              />
            )}
          </div>

          {/* Problem Description */}
          <textarea
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="Describe the problem you want solved..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedImage || !problemDescription}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Solve Puzzle
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
          )}

          {/* Solution */}
          {solution && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="font-semibold mb-2">Solution:</h2>
              <p className="whitespace-pre-wrap">{solution}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleSolver;