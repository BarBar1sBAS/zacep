from http.server import BaseHTTPRequestHandler,HTTPServer
from pathlib import Path
import json,base64
ROOT=Path(__file__).resolve().parent
ASSETS=ROOT.parents[1]/'prototype/public/assets'
class Handler(BaseHTTPRequestHandler):
 def headers_(self,typ='application/json'):
  self.send_response(200);self.send_header('Content-Type',typ);self.send_header('Access-Control-Allow-Origin','*');self.send_header('Access-Control-Allow-Headers','Content-Type');self.send_header('Access-Control-Allow-Methods','GET,POST,OPTIONS');self.end_headers()
 def do_OPTIONS(self):self.headers_()
 def do_GET(self):
  if self.path=='/assets':
   self.headers_();self.wfile.write(json.dumps({p.stem:base64.b64encode(p.read_bytes()).decode() for p in ASSETS.glob('*.png')}).encode())
  else:self.send_error(404)
 def do_POST(self):
  name=Path(self.path).name
  dest=ROOT/'review'/name
  dest.write_bytes(self.rfile.read(int(self.headers['Content-Length'])))
  self.headers_();self.wfile.write(b'{"ok":true}')
HTTPServer(('127.0.0.1',8795),Handler).serve_forever()
