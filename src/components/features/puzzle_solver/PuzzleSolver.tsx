import React, { useState } from 'react';
import { Upload, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';

const PuzzleSolver = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolveProblem = () => {
    setLoading(true);
    setSolution('');

    // Simulate API call
    setTimeout(() => {
      // Mock data for demonstration
      setSolution(
        `The solution to the puzzle involves the following steps:
        1. Identify the key patterns in the image.
        2. Analyze the relationships between the elements.
        3. Apply logical reasoning to deduce the solution.
        4. Verify the solution against the problem description.`
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 animate-slide-in-top">
        <div className="flex items-center space-x-4">
          <Upload className="w-8 h-8 text-blue-600 transition-transform duration-300 hover:scale-110" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Puzzle Solver</h1>
            <p className="text-gray-600">Upload a puzzle image and get the solution</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl animate-slide-in-left">
          <h2 className="text-lg font-semibold mb-6 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Upload Puzzle Image
          </h2>
          <div className="space-y-6">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all duration-300">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded Puzzle"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400">PNG, JPG, or JPEG</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Display Uploaded Image Fully */}
        {uploadedImage && (
          <div className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl animate-slide-in-left">
            <h2 className="text-lg font-semibold mb-6 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Uploaded Image
            </h2>
            <div className="flex justify-center">
              <img
                src={uploadedImage}
                alt="Uploaded Puzzle"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        )}

        {/* Problem Description Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl animate-slide-in-left">
          <h2 className="text-lg font-semibold mb-6 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Describe the Problem
          </h2>
          <div className="space-y-6">
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="e.g., Solve this Sudoku puzzle, Find the missing piece..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-300 hover:border-blue-300 focus:scale-[1.02] resize-none"
              rows={4}
            />

            <button
              onClick={handleSolveProblem}
              disabled={!uploadedImage || !problemDescription.trim() || loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                        hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed 
                        transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? 'Solving...' : 'Solve Problem'}
            </button>
          </div>
        </div>

        {/* Solution Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-right">
          <h2 className="text-lg font-semibold mb-6">Solution</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-gray-600">Solving the puzzle...</p>
            </div>
          ) : solution ? (
            <div className="bg-gray-50 rounded-xl p-5 transform transition-all duration-300 hover:scale-[1.01]">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-800">Generated Solution</h3>
              </div>
              <pre className="whitespace-pre-wrap text-gray-900">{solution}</pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-pulse">
              <ImageIcon className="w-12 h-12 mb-2" />
              <p>Upload an image and describe the problem to get the solution</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleSolver;