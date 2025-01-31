import subprocess
import sys
from typing import List
import time
import signal
import os

class ServerManager:
    def __init__(self, base_port: int = 8000):
        self.base_port = base_port
        self.processes: List[subprocess.Popen] = []
        
    def add_server(self, module_name: str, port: int) -> None:
        """Start a new FastAPI server process"""
        cmd = [
            sys.executable, "-m", "uvicorn",
            f"{module_name}:app",
            "--reload",
            "--port", str(port),
            "--host", "0.0.0.0"
        ]
        
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        self.processes.append(process)
        print(f"Started server {module_name} on port {port}")
        
    def stop_all(self) -> None:
        """Stop all running server processes"""
        for process in self.processes:
            process.terminate()
        
        # Wait for processes to terminate
        for process in self.processes:
            process.wait()
            
        self.processes = []
        print("All servers stopped")

def signal_handler(sig, frame):
    """Handle Ctrl+C to gracefully shut down all servers"""
    print("\nShutting down all servers...")
    manager.stop_all()
    sys.exit(0)

if __name__ == "__main__":
    # List of your FastAPI modules
    servers = [
        "ai-tutor",
        "bos",
        "code_gen",
        "flowchart",
        "knowledge_check",
        "puzzlesolver",
        "resourse",
        "sosexamprep"
    ]
    
    # Initialize the server manager
    manager = ServerManager(base_port=8000)
    
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        # Start all servers with incrementing ports
        for i, server in enumerate(servers):
            port = manager.base_port + i
            manager.add_server(server, port)
            
        print("\nAll servers are running. Press Ctrl+C to stop all servers.")
        
        # Keep the script running
        while True:
            time.sleep(1)
            
    except Exception as e:
        print(f"Error: {e}")
        manager.stop_all()
        sys.exit(1)
