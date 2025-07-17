// Network connectivity test for AWS RDS
// Run with: node scripts/test-network.js

import net from 'net'
import dns from 'dns'
import { promisify } from 'util'

const lookup = promisify(dns.lookup)

const RDS_HOST = 'forecastle-db.chegimka8bgw.eu-north-1.rds.amazonaws.com'
const RDS_PORT = 5432

async function testNetworkConnectivity() {
  console.log('🌐 Testing network connectivity to AWS RDS...')
  console.log(`📍 Host: ${RDS_HOST}`)
  console.log(`🚪 Port: ${RDS_PORT}`)
  console.log('')

  // Test 1: DNS Resolution
  try {
    console.log('🔍 Step 1: Testing DNS resolution...')
    const { address, family } = await lookup(RDS_HOST)
    console.log(`✅ DNS resolved successfully:`)
    console.log(`   IP Address: ${address}`)
    console.log(`   IP Version: IPv${family}`)
  } catch (error) {
    console.log(`❌ DNS resolution failed: ${error.message}`)
    console.log(`💡 This means the hostname is invalid or unreachable`)
    return
  }

  // Test 2: TCP Connection
  console.log('')
  console.log('🔌 Step 2: Testing TCP connection...')
  
  return new Promise((resolve) => {
    const socket = new net.Socket()
    const timeout = 10000 // 10 seconds

    const timer = setTimeout(() => {
      socket.destroy()
      console.log(`❌ Connection timeout (${timeout/1000}s)`)
      console.log(`💡 Possible causes:`)
      console.log(`   - Security group doesn't allow connections`)
      console.log(`   - RDS instance is not publicly accessible`)
      console.log(`   - Instance is stopped or in wrong region`)
      console.log(`   - Firewall blocking outbound connections`)
      resolve(false)
    }, timeout)

    socket.on('connect', () => {
      clearTimeout(timer)
      socket.destroy()
      console.log(`✅ TCP connection successful!`)
      console.log(`💡 Network connectivity is working`)
      console.log(`🔐 If database connection still fails, it's likely:`)
      console.log(`   - Wrong username/password`)
      console.log(`   - Database doesn't exist`)
      console.log(`   - User doesn't have permissions`)
      resolve(true)
    })

    socket.on('error', (error) => {
      clearTimeout(timer)
      console.log(`❌ TCP connection failed: ${error.message}`)
      
      if (error.code === 'ECONNREFUSED') {
        console.log(`💡 Connection refused - possible causes:`)
        console.log(`   - RDS instance is stopped`)
        console.log(`   - Security group blocks connections`)
        console.log(`   - Wrong port number`)
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`💡 Connection timeout - possible causes:`)
        console.log(`   - Security group doesn't allow your IP`)
        console.log(`   - RDS in private subnet without public access`)
        console.log(`   - Network firewall blocking connection`)
      } else if (error.code === 'ENOTFOUND') {
        console.log(`💡 Host not found - possible causes:`)
        console.log(`   - Wrong endpoint URL`)
        console.log(`   - Wrong AWS region`)
        console.log(`   - DNS resolution issues`)
      }
      resolve(false)
    })

    socket.connect(RDS_PORT, RDS_HOST)
  })
}

// Run the test
testNetworkConnectivity().then(success => {
  console.log('')
  if (success) {
    console.log('🎉 Network test passed! Try database connection again.')
  } else {
    console.log('🔧 Fix the network issues above, then try again.')
  }
  process.exit(success ? 0 : 1)
})
